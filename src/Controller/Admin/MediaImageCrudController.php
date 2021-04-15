<?php

namespace ICS\MediaBundle\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use ICS\MediaBundle\Entity\MediaFile;
use ICS\MediaBundle\Entity\MediaImage;
use ICS\MediaBundle\Form\Type\MediaType;

class MediaImageCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return MediaImage::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'Pictures management');
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            ImageField::new('path'),
            TextField::new('name'),
            TextField::new('mimeType'),
            TextField::new('hash'),
            NumberField::new('filesize')->formatValue(function($value){
                return MediaFile::HumanizeSize(str_replace(',','',$value));
            }),
            NumberField::new('width')->formatValue(function($value){
                return str_replace(',','',$value);
            }),
            NumberField::new('height')->formatValue(function($value){
                return str_replace(',','',$value);
            }),

        ];
    }

    public function configureActions(Actions $actions): Actions
    {
        return $actions
            ->remove(Crud::PAGE_INDEX, Action::NEW)
            ->remove(Crud::PAGE_INDEX, Action::EDIT)
            ->remove(Crud::PAGE_DETAIL, Action::EDIT)
        ;
    }
}
