<?php

namespace ICS\MediaBundle\Command;

use Doctrine\Common\Persistence\ManagerRegistry;
use ICS\MediaBundle\Entity\MediaFile;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ContainerInterface;

class MediaVerifyFilesCommand extends Command
{
    protected static $defaultName = 'media:files:verify';

    private $doctrine;
    private $container;

    public function __construct(ManagerRegistry $doctrine, ContainerInterface $container)
    {
        parent::__construct();

        $this->doctrine = $doctrine;
        $this->container = $container;
    }

    protected function configure()
    {
        $this
            ->setDescription('Verify files between filesystem and database.');
    }

    protected function execute(InputInterface $input,OutputInterface $output)
    {
        $io= new SymfonyStyle($input,$output);

        $files=$this->doctrine->getRepository(MediaFile::class)->findAll();
        $em=$this->doctrine->getManager();

        $counter=count($files);
        $errors=array();
        $warning=array();
        $deleted=array();

        foreach($files as $file)
        {
            if(!file_exists($file->getPath(true)))
            {
                $errors[]="Le fichier ".$file->getPath()." n'existe plus sur le système de fichier.";
                $deleted[]=$file;
                $em->remove($file);
            }
            else
            {
                $newHash = md5_file($file->getPath(true));

                if($newHash != $file->getHash())
                {
                    $warning[]="Le fichier ".$file->getPath()." à été modifier.";
                }
            }

            
        }

        $em->flush();

        if(count($deleted)==0 && count($warning)==0)
        {
            $io->success('File verification success. No file has deleted and No files has modify');
        }
        
        if(count($warning)>0)
        {
            $text="";

            foreach($warning as $warn)
            {
                $text.=$warn."\n";
            }

            $text.="This files has be modified on filesystem.";

            $io->warning($text);
        }

        if(count($deleted)>0)
        {
            $text="";

            foreach($deleted as $del)
            {
                $text.=$del."\n";
            }

            $text.="This files has deleted on filesystem, and removed from database.";

            $io->error($text);
        }


        return 0;
    }
}