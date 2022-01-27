<?php

namespace ICS\MediaBundle\Entity;

use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use ReflectionClass;
use ICS\MediaBundle\Repository\MediaFileRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use DateTime;

/**
 * @ORM\Entity(repositoryClass=MediaFileRepository::class)
 * @ORM\Table(schema="medias")
 * @ORM\InheritanceType("JOINED")
 * @ORM\DiscriminatorColumn(name="discr", type="string")
 * @ORM\HasLifecycleCallbacks()
 */
class MediaFile
{
    public static $mimes = [];

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;
    /**
     * @ORM\Column(type="string",nullable=false)
     */
    private $basePath;
    /**
     * @ORM\Column(type="string",nullable=false)
     */
    private $path;
    /**
     * @ORM\Column(type="string",nullable=false)
     */
    private $fileName;
    /**
     * @ORM\Column(type="string",nullable=false)
     */
    private $mime;
    /**
     * @ORM\Column(type="string",nullable=true)
     */
    private $hash;
    /**
     * @ORM\Column(type="datetime",nullable=false)
     */
    private $creationDate;
    /**
     * @ORM\Column(type="datetime",nullable=false)
     */
    private $modificationDate;

    private $updateDate;
    /**
     * @ORM\Column(type="integer",nullable=false)
     */
    private $size;
    /**
     * @ORM\Column(type="string",nullable=false)
     */
    private $publicDir;

    // Date for object traitement
    private $config;
    /**
     * @ORM\Column(type="string",nullable=true)
     */
    private $filestatus = '';
    /**
     * @ORM\Column(type="text",nullable=true)
     */
    private $statusMessage = '';

    private $absoluteDir;

    private $filepath;

    private $newpath;

    public function __construct(string $filepath='',string $newpath='')
    {
        $this->filepath = $filepath;
        $this->newpath = $newpath;
        if($filepath!='')
        {
            $this->fileName=\basename($filepath);
        }
    }

    public function load(string $filepath,string $newPath): void
    {
        // File Moved in medias architecture
        $this->createDir($this->absoluteDir.'/'.$newPath);

        if($newPath[\strlen($newPath)-1] =='/')
        {
            $this->path = $this->basePath.'/'.$newPath.$this->fileName;
        }
        else
        {
            $this->path = $this->basePath.'/'.$newPath.'/'.$this->fileName;
        }
        
        $counter=1;
        $firstFilename=basename($this->publicDir.'/'.$this->path);
        while(\file_exists($this->publicDir.'/'.$this->path))
        {
            $infos = \pathinfo($this->publicDir.'/'.$this->path);
            $extension = '.'.$infos['extension'];

            $this->fileName = \str_replace($extension,'',$firstFilename).'_'.$counter.$extension;

            if($newPath[\strlen($newPath)-1] =='/')
            {
                $this->path = $this->basePath.'/'.$newPath.$this->fileName;
            }
            else
            {
                $this->path = $this->basePath.'/'.$newPath.'/'.$this->fileName;
            }

            $counter++;
        }

        \rename($filepath,$this->publicDir.'/'.$this->path);

        $this->filepath=$this->publicDir.'/'.$this->path;

        //File compute
        $this->compute();
    }

    protected function compute($withHash=true)
    {
        $this->updateData($withHash);
    }

    public function updateData($withHash=false)
    {
        $this->creationDate = DateTime::createFromFormat("d/m/Y H:i:s.m",date('d/m/Y H:i:s.m',\filectime($this->getPath(true))));
        $this->modificationDate = DateTime::createFromFormat("d/m/Y H:i:s.m",date('d/m/Y H:i:s.m',\filemtime($this->getPath(true))));
        $this->size = \filesize($this->getPath(true));
        $this->mime = \mime_content_type($this->getPath(true));
        if($withHash)
        {
            $this->hash = \md5_file($this->getPath(true));
        }
    }

    public function createDir(string $dir)
    {
        if(!\file_exists($dir))
        {
            mkdir($dir,0775,true);
        }
    }

    public function getPath(bool $full=false)
    {
        if($full)
        {
            return $this->publicDir.'/'.$this->path;
        }
        else
        {
            return $this->path;
        }
    }

    public function getSize($human=false)
    {
        if($human)
        {
            return MediaFile::getHumanSize($this->size);
        }
        else
        {
            return $this->size;
        }
    }

    public static function getHumanSize($size)
    {
        $unit[]='o';
        $unit[]='ko';
        $unit[]='Mo';
        $unit[]='Go';
        $unit[]='Po';

        $i=0;

        while($size > 1024)
        {
            $size=$size/1024;
            $i++;
        }

        return \number_format($size,2).' '.$unit[$i];
    }


    /**
     * Get the value of mime
     */ 
    public function getMime()
    {
        return $this->mime;
    }

    /**
     * Get the value of hash
     */ 
    public function getHash()
    {
        return $this->hash;
    }

    /**
     * Get the value of creationDate
     */ 
    public function getCreationDate()
    {
        return $this->creationDate;
    }

    /**
     * Get the value of modificationDate
     */ 
    public function getModificationDate()
    {
        return $this->modificationDate;
    }

    /**
     * Get the value of updateDate
     */ 
    public function getUpdateDate()
    {
        return $this->updateDate;
    }

    /**
     * Set the value of updateDate
     *
     * @return  self
     */ 
    public function setUpdateDate($updateDate)
    {
        $this->updateDate = $updateDate;

        return $this;
    }

    /**
     * Get the value of id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of config
     */ 
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * Set the value of basePath
     *
     * @return  self
     */ 
    public function setBasePath($basePath)
    {
        $this->basePath = $basePath;
        $this->absoluteDir = $this->publicDir.'/'.$this->basePath;
        return $this;
    }

    /**
     * Set the value of publicDir
     *
     * @return  self
     */ 
    public function setPublicDir($publicDir)
    {
        $this->publicDir = $publicDir;
        $this->absoluteDir = $this->publicDir.'/'.$this->basePath;
        return $this;
    }

    /**
     * Get the value of absoluteDir
     */ 
    public function getAbsoluteDir()
    {
        return $this->absoluteDir;
    }

    /**
     * Get the value of filepath
     */ 
    public function getFilepath()
    {
        return $this->filepath;
    }

    /**
     * Set the value of filepath
     *
     * @return  self
     */ 
    public function setFilepath($filepath)
    {
        $this->filepath = $filepath;

        return $this;
    }

    /**
     * Get the value of newpath
     */ 
    public function getNewpath()
    {
        return $this->newpath;
    }

    /**
     * Set the value of newpath
     *
     * @return  self
     */ 
    public function setNewpath($newpath)
    {
        $this->newpath = $newpath;

        return $this;
    }

    /**
     * Set the value of fileName
     *
     * @return  self
     */ 
    public function setFileName($fileName)
    {
        $this->fileName = $fileName;

        return $this;
    }

    /**
     * Set the value of path
     *
     * @return  self
     */ 
    public function setPath($path)
    {
        $this->path = $path;

        return $this;
    }

    /**
     * Get the value of filestatus
     */ 
    public function getFilestatus()
    {
        return $this->filestatus;
    }

    /**
     * Set the value of filestatus
     *
     * @return  self
     */ 
    public function setFilestatus($filestatus)
    {
        $this->filestatus = $filestatus;

        return $this;
    }

    /**
     * Get the value of statusMessage
     */ 
    public function getStatusMessage()
    {
        return $this->statusMessage;
    }

    /**
     * Set the value of statusMessage
     *
     * @return  self
     */ 
    public function setStatusMessage($statusMessage)
    {
        $this->statusMessage = $statusMessage;

        return $this;
    }

    /**
     * Get the value of fileName
     */ 
    public function getFileName()
    {
        return $this->fileName;
    }

    public function getClassName()
    {
        return (new ReflectionClass($this))->getShortName();
    }

    public function __toString()
    {
        if($this->getPath() != null)
        {
            return $this->getPath();
        }
        else
        {
            return "Nouveau Fichier";
        }
    }
}