<?php
namespace ICS\MediaBundle\EntityListener;

use DateTime;
use ICS\MediaBundle\Entity\MediaFile;
use Symfony\Component\HttpKernel\KernelInterface;

class MediaFileEntityListener
{
    private $kernel;

    public function __construct(KernelInterface $kernel)
    {
        $this->kernel = $kernel;
    }

    public function prePersist(MediaFile $media)
    {
        $this->config = $this->kernel->getContainer();
        $config = $this->config->getParameter('medias');
        $media->setBasePath($config['path'])
                ->setPublicDir($this->kernel->getProjectDir().'/public')
        ;
        $media->createDir($media->getAbsoluteDir());
        $media->load($media->getFilepath(),$media->getNewpath());
        $media->setUpdateDate(new DateTime());
    }

    public function preRemove(MediaFile $media)
    {
        if(\file_exists($media->getPath(true)))
        {
            \unlink($media->getPath(true));
        }
    }
}
