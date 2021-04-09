<?php

namespace ICS\MediaBundle\Service;

use ICS\MediaBundle\Entity\MediaFile;
use ICS\MediaBundle\Entity\MediaImage;
use Symfony\Component\DependencyInjection\ContainerInterface;

class MediaService
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function add($path)
    {
        $type = mime_content_type($path);

        switch($type)
        {
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
            case 'image/svg':
            case 'image/jpg':
                $media=new MediaImage($this->container);
                $media->load($path,'pictures');
                break;
            default:
                $media=new MediaFile($this->container);
                $media->load($path);
        }

        return $media;
    }
}