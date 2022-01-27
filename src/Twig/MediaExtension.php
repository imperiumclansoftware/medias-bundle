<?php

namespace ICS\MediaBundle\Twig;

use Twig\TwigFunction;
use Twig\TwigFilter;
use Twig\Extension\AbstractExtension;
use Twig\Environment;
use Symfony\Component\DependencyInjection\ContainerInterface;
use ICS\MediaBundle\Entity\MediaImage;
use ICS\MediaBundle\Entity\MediaFile;
use Doctrine\ORM\EntityManagerInterface;

/**
 * NavBarExtension.
 *
 * @author David Dutas <david.dutas@ia.defensecdd.gouv.fr >
 */
class MediaExtension extends AbstractExtension
{
    private $doctrine;
    private $container;

    /**
     * Constructeur.
     *
     * @param RegistryInterface $doctrine
     */
    public function __construct(EntityManagerInterface $doctrine, ContainerInterface $container)
    {
        $this->doctrine = $doctrine;
        $this->container = $container;
    }

    public function getFilters()
    {
        return [
            new TwigFilter('mediaType', [$this, 'MediaType'], [
                'is_safe' => ['html'],
                'needs_environment' => true,
            ]),
        ];
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('mediaGraphData', [$this, 'MediaGraphData'], [
                'is_safe' => ['html'],
                'needs_environment' => true,
            ]),
        ];
    }

    public function MediaType(Environment $env, MediaFile $file)
    {
        if (is_a($file, MediaImage::class)) {
            return 'image';
        }

        return 'file';
    }


    public function mediaGraphData(Environment $env)
    {
        $fileRepo = $this->doctrine->getRepository(MediaFile::class);
        $imageRepo = $this->doctrine->getRepository(MediaImage::class);

        $files=count($fileRepo->findAll());
        $images=count($imageRepo->findAll());

        $filesQuery=$fileRepo->createQueryBuilder('f')
        ->select("sum(f.size)")
        ->getQuery();
        $filesSize=$filesQuery->getSingleScalarResult();

        $ImagesQuery=$imageRepo->createQueryBuilder('i')
        ->select("sum(i.size)")
        ->getQuery();
        $ImagesSize=$ImagesQuery->getSingleScalarResult();

        $data[]=[
            'name'=> 'files',
            'y' => ($files - $images)
        ];
        $data[]=[
            'name' => 'images',
            'y' => $images
        ];

        $sdata=[];
        $sdata[]=[
            'name'=> 'files',
            'y' => ($filesSize - $ImagesSize)
        ];
        $sdata[]=[
            'name' => 'images',
            'y' => $ImagesSize
        ];



        return $env->render('@Media/admin/dashboard.html.twig', [
            'data' => $data,
            'sdata' => $sdata
        ]);
    }
}
