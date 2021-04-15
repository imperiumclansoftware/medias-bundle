<?php

namespace ICS\MediaBundle\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\ArrayField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\UrlField;
use ICS\MediaBundle\Entity\MediaFile;
use ICS\MediaBundle\Form\Type\MediaType;

class MediaFileCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return MediaFile::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'File management');
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            UrlField::new('path'),
            TextField::new('name'),
            TextField::new('mimeType'),
            TextField::new('hash'),
            NumberField::new('filesize')->formatValue(function($value){
                return MediaFile::HumanizeSize(str_replace(',','',$value));
            })
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
