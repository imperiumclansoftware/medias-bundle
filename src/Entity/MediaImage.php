<?php
    namespace ICS\MediaBundle\Entity;

use Symfony\Component\HttpKernel\KernelInterface;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use ICS\MediaBundle\Entity\MediaFile;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Event\LifecycleEventArgs;

/**
 * @ORM\Entity()
 * @ORM\Table(schema="medias")
 * @ORM\HasLifecycleCallbacks()
 */
class MediaImage extends MediaFile
{

    public static $mimes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    // public static $mimes = ['image/jpeg', 'image/png', 'image/gif'];

    /**
     * @ORM\Column(type="integer",nullable=false)
     */
    private $width;
    /**
     * @ORM\Column(type="integer",nullable=false)
     */
    private $height;

    private $exifData=null;

    private $thumbnails;

    protected function compute($withHash=true)
    {
        parent::compute($withHash);

        $size=\getimagesize($this->getPath(true));

        $this->width = $size[0];
        $this->height = $size[1];

        if($this->getMime()=='image/jpeg')
        {
            $this->exifData = \exif_read_data($this->getPath(true));
        }
    }

    /**
     * Get the value of width
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * Get the value of height
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * Get the value of exifData
     */
    public function getExifData()
    {
        return $this->exifData;
    }

    public function generateCachePaths(CacheManager $imagineCacheManager,$filters)
    {
        foreach($filters as $key => $filter)
        {
            $this->thumbnails[$key] = $imagineCacheManager->getBrowserPath($this->getPath(),$key);
        }
    }

    /**
     * Get the value of thumbnails
     */
    public function getThumbnails()
    {
        return $this->thumbnails;
    }

    /**
     * Set the value of thumbnails
     *
     * @return  self
     */
    public function setThumbnails($thumbnails)
    {
        $this->thumbnails = $thumbnails;

        return $this;
    }

}