<?php

namespace ICS\MediaBundle\Service;

use Symfony\Component\HttpKernel\KernelInterface;
use ICS\MediaBundle\Entity\MediaFile;
use Doctrine\ORM\EntityManagerInterface;
use Exception;

class MediaService
{

    private $doctrine;

    public function __construct(EntityManagerInterface $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function getMediaType($filepath)
    {
        if (\file_exists($filepath)) {
            $mime = mime_content_type($filepath);

            foreach ($this->doctrine->getConfiguration()->getMetadataDriverImpl()->getAllClassNames() as $cl) {
                if (get_parent_class($cl) == MediaFile::class && \in_array($mime, $cl::$mimes)) {
                    return $cl;
                }
            }

            return MediaFile::class;
        }

        return null;
    }

    public function getMaxUploadSize()
    {
        $max_size = -1;
        $post_overhead = 1024; // POST data contains more than just the file upload; see comment from @jlh
        $files = array_merge(array(php_ini_loaded_file()), explode(",\n", php_ini_scanned_files()));
        foreach (array_filter($files) as $file) {
            try {
                $ini = parse_ini_file($file,true);
                $regex = '/^([0-9]+)([bkmgtpezy])$/i';
                if (!empty($ini['post_max_size']) && preg_match($regex, $ini['post_max_size'], $match)) {
                    $post_max_size = round($match[1] * pow(1024, stripos('bkmgtpezy', strtolower($match[2]))));
                    if ($post_max_size > 0) {
                        $max_size = $post_max_size - $post_overhead;
                    }
                }
                if (!empty($ini['upload_max_filesize']) && preg_match($regex, $ini['upload_max_filesize'], $match)) {
                    $upload_max_filesize = round($match[1] * pow(1024, stripos('bkmgtpezy', strtolower($match[2]))));
                    if ($upload_max_filesize > 0 && ($max_size <= 0 || $max_size > $upload_max_filesize)) {
                        $max_size = $upload_max_filesize;
                    }
                }
            }
            catch(Exception $ex)
            {

            }
        }

        return $max_size;
    }
}
