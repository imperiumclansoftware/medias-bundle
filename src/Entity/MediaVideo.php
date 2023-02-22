<?php
namespace ICS\MediaBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table(schema="medias")
 * @ORM\HasLifecycleCallbacks()
 */
class MediaVideo extends MediaFile
{

    public static $mimes = ['video/mp4', 'video/avi', 'video/mpeg', 'video/mkv'];

    /**
     * @ORM\Column(type="integer",nullable=true)
     */
    private $width;
    /**
     * @ORM\Column(type="integer",nullable=true)
     */
    private $height;
    /**
     * @ORM\Column(type="integer",nullable=true)
     */
    private $duration;

    protected function compute($withHash=false)
    {
        parent::compute($withHash);

        //TODO : Analyse de la videos avec composer require jamesHeinrich/getid3 
    }

    /**
     * Get the value of width
     */ 
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * Set the value of width
     *
     * @return  self
     */ 
    public function setWidth($width)
    {
        $this->width = $width;

        return $this;
    }

    /**
     * Get the value of height
     */ 
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * Set the value of height
     *
     * @return  self
     */ 
    public function setHeight($height)
    {
        $this->height = $height;

        return $this;
    }

    /**
     * Get the value of duration
     */ 
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Set the value of duration
     *
     * @return  self
     */ 
    public function setDuration($duration)
    {
        $this->duration = $duration;

        return $this;
    }
}