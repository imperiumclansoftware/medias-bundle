<?php

namespace ICS\MediaBundle\Twig;

use Doctrine\ORM\EntityManagerInterface;
use ICS\MediaBundle\Entity\MediaFile;
use ICS\MediaBundle\Entity\MediaImage;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Twig\Environment;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

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
        return [];
    }

    public function MediaType(Environment $env, MediaFile $file)
    {
        if (is_a($file, MediaImage::class)) {
            return 'image';
        }

        return 'file';
    }
}
