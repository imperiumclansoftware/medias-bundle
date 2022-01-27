<?php

namespace ICS\MediaBundle\Command;

use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Command\Command;
use ICS\MediaBundle\Entity\MediaFile;
use Doctrine\ORM\EntityManagerInterface;

class secureFileCommand extends Command
{
    private $io;
    private $doctrine;

    protected static $defaultName = 'media:file:verify';

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
        $files = $this->doctrine->getRepository(MediaFile::class)->findAll();
        $em = $this->doctrine;

        $error=0;
        $warning=0;
        $ok=0;
        $this->io->title('Test file system integrity');
        $this->io->progressStart(count($files));
        foreach ($files as $file) {
            if (\file_exists($file->getPath(true))) {
                $file->updateData();
                $compare = \md5_file($file->getPath(true));

                if ($compare == $file->getHash()) {
                    $file->setFileStatus('ok');
                    $file->setStatusMessage('');
                    $ok++;
                } else {
                    $file->setFileStatus('warning');
                    $file->setStatusMessage('File was modified externaly');
                    $warning++;
                }
            } else {
                $file->setFileStatus('error');
                $file->setStatusMessage('File does not exist');
                $error++;
            }
            
            $em->persist($file);
            $this->io->progressAdvance();
        }

        $em->flush();

        $this->io->progressFinish();

        $this->io->title('Results');

        $this->io->table(['error','warning','ok'], [[$error,$warning,$ok]]);
        return Command::SUCCESS;
    }
}
