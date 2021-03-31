<?php

namespace ICS\MediaBundle\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use ICS\MediaBundle\Entity\MediaImage;

class MediaImageCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return MediaImage::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'Gestion des images');
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            //IdField::new('id'),
            ImageField::new('path'),
            TextField::new('hash'),
        ];
    }
}
