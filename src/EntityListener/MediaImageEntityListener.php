<?php
namespace ICS\MediaBundle\EntityListener;

use DateTime;
use ICS\MediaBundle\Entity\MediaImage;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Symfony\Component\HttpKernel\KernelInterface;

class MediaImageEntityListener
{
    private $kernel;
    private $imagineCacheManager;

    public function __construct(KernelInterface $kernel,CacheManager $imagineCacheManager)
    {
        $this->kernel = $kernel;
        $this->imagineCacheManager = $imagineCacheManager;
    }

    public function prePersist(MediaImage $media)
    {
        $this->postLoad($media);
    }

    public function postLoad(MediaImage $media)
    {
        $config = $this->kernel->getContainer();
        $filters = $config->getParameter('liip_imagine.filter_sets');
        if($this->imagineCacheManager != null)
        {
            $this->cacheManager = $this->imagineCacheManager;
            $media->generateCachePaths($this->imagineCacheManager,$filters);
        }
    }
}
