<?php

namespace ICS\MediaBundle\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use ICS\MediaBundle\Entity\MediaFile;

class MediaFileCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return MediaFile::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'Gestion des fichiers');
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            //IdField::new('id'),
            TextField::new('path'),
            TextField::new('hash'),
        ];
    }
}
