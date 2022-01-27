<?php

namespace ICS\MediaBundle\Command;

use Doctrine\ORM\EntityManagerInterface;
use ICS\MediaBundle\Entity\MediaFile;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Formatter\OutputFormatterStyle;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class duplicateFileCommand extends Command
{
    private $io;
    private $doctrine;

    protected static $defaultName = 'media:search:duplicate';

    public function __construct(EntityManagerInterface $doctrine)
    {
        parent::__construct();
        $this->doctrine= $doctrine;
    }

    protected function configure()
    {
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->io = new SymfonyStyle($input, $output);

        $fileArray = [];

        $this->io->title('Recherhe des doublons');

        $files = $this->doctrine->getRepository(MediaFile::class)->findAll();

        $this->io->progressStart(count($files));

        foreach ($files as $file) {
            $fileArray[$file->getHash()][]=$file;
            $this->io->progressAdvance();
        }

        $this->io->progressFinish();

        $this->io->title('Extraction des fichiers uniques');

        $this->io->progressStart(count($fileArray));
        foreach ($fileArray as $key=>$file) {
            if (count($file) <= 1) {
                unset($fileArray[$key]);
            }

            $this->io->progressAdvance();
        }

        $this->io->progressFinish();
        $em=$this->doctrine;
        foreach ($fileArray as $key => $file) {
            $this->io->warning(count($file).' duplicates found for file '.$file[0]->getPath().' with hash '.$key);
            foreach ($file as $number => $removed) {
                if ($number > 0) {
                    $em->remove($removed);
                    $em->flush();
                }
            }
        }

        return Command::SUCCESS;
    }
}
