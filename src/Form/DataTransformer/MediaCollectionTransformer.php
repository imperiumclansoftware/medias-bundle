<?php

namespace ICS\MediaBundle\Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;
use ICS\MediaBundle\Service\MediaService;;
use ICS\MediaBundle\MediaBundle;
use ICS\MediaBundle\Entity\MediaFile;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

class MediaCollectionTransformer implements DataTransformerInterface
{
    /**
     * Undocumented variable
     *
     * @var MediaService
     */
    private $service;
    private $outputdir='';
    private $oldValue=null;
    private $required;
    private $em;

    public function __construct(MediaService $service,EntityManagerInterface $em)
    {
        $this->service = $service;
        $this->em=$em;
    }

    public function transform($media): ?Collection
    {
        return $media;
    }

    public function reverseTransform($files): ?Collection
    {
        $collection = $this->oldValue;
        foreach($files as $file)
        {
            $media=$this->em->getRepository(MediaFile::class)->findOneBy(['path' => $file]);

            if($media==null)
            {
                $type = $this->service->getMediaType($file);
                $media = new $type($file,$this->outputdir);
            }
            
            if(!$collection->contains($media))
            {
                $collection->add($media);
            }
        }

        return $collection;
    }


    /**
     * Get the value of outputdir
     */ 
    public function getOutputdir()
    {
        return $this->outputdir;
    }

    /**
     * Set the value of outputdir
     *
     * @return  self
     */ 
    public function setOutputdir($outputdir)
    {
        $this->outputdir = $outputdir;

        return $this;
    }

    /**
     * Get the value of oldValue
     */ 
    public function getOldValue()
    {
        return $this->oldValue;
    }

    /**
     * Set the value of oldValue
     *
     * @return  self
     */ 
    public function setOldValue($oldValue)
    {
        $this->oldValue = $oldValue;

        return $this;
    }

    /**
     * Get the value of required
     */ 
    public function getRequired()
    {
        return $this->required;
    }

    /**
     * Set the value of required
     *
     * @return  self
     */ 
    public function setRequired($required)
    {
        $this->required = $required;

        return $this;
    }
}