<?php

/**
 * Source code of Entity MediaFile
 *
 * @author David Dutas <david.dutas@ia.defensecdd.gouv.fr>
 */

namespace ICS\MediaBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\DBAL\Types\BigIntType;
use Exception;
use phpDocumentor\Reflection\Types\Integer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

/**
 * File Management Entity
 *
 * @ORM\Table(name="media_image", schema="medias")
 * @ORM\Entity
 * @ORM\MappedSuperclass
 *
 * @package MediaBundle
 */
class MediaImage extends MediaFile
{

    /**
     * Width of image in pixels
     *
     * @ORM\Column(type="integer", nullable=false)
     *
     * @var int
     */
    protected $width;
    /**
     * Height of image in pixels
     *
     * @ORM\Column(type="integer", nullable=false)
     *
     * @var int
     */
    protected $height;

    public function __construct(ContainerInterface $container = null)
    {
        parent::__construct($container);
    }


    public function Load(string $filepath, $movedDirectory = null, $withHash = true): bool
    {
        $result = parent::Load($filepath, $movedDirectory, $withHash);

        try {
            $size = getimagesize($this->getPath(true));

            $this->width = $size[0];
            $this->height = $size[1];
            $result = $result && true;
        } catch (Exception $ex) {
            $result = $result && false;
        }

        return $result;
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

    public function getSize(): string
    {
        return $this->width . "x" . $this->height;
    }
}
