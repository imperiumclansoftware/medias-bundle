<?php

namespace ICS\MediaBundle\Form\DataTransformer;

use Doctrine\ORM\EntityManagerInterface;
use ICS\MediaBundle\Entity\MediaFile;
use ICS\MediaBundle\Service\MediaService;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class MediaTransformer implements DataTransformerInterface
{
    private $slugger;
    private $service;

    public function __construct(MediaService $service,SluggerInterface $slugger)
    {
        $this->service=$service;
        $this->slugger=$slugger;
    }

    public function transform($media): string
    {
        if (null === $media) {
            return '';
        }

        return $media->getPath();
    }

    public function reverseTransform($file): ?MediaFile
    {
        if (!$file) {
            return null;
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $fileName = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();

        try {
            move_uploaded_file($file->getPathname(),$file->getPath().'/'.$fileName);
            $media=$this->service->add($file->getPath().'/'.$fileName);
        } catch (FileException $e) {
            throw $e;
        }

        return $media;
    }
}
