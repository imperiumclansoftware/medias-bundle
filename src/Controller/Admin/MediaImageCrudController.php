<?php

namespace ICS\MediaBundle\Controller\Admin;

use ICS\MediaBundle\Form\Type\MediaType;
use ICS\MediaBundle\Entity\MediaImage;
use ICS\MediaBundle\Entity\MediaFile;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;

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
            TextField::new('filestatus')
            ->formatValue(function($value){
                switch($value)
                {
                    case 'ok': return '<i class="fa fa-check text-success" title="File is Ok"></i>';
                    case 'warning': return '<i class="fa fa-exclamation-triangle text-warning" title="File was modified externaly"></i>';
                    case 'error': return '<i class="fa fa-exclamation-circle text-danger" title="File does not exist"></i>';
                    case null: return '<i class="fa fa-exclamation text-info" title="No verified"></i>';
                    default: return '<i class="fa fa-exclamation text-info" title="No verified"></i>';
                }
            })
            ,
            ImageField::new('path'),
            TextField::new('filename'),
            TextField::new('mime'),
            TextField::new('hash'),
            NumberField::new('size')->formatValue(function($value){
                return MediaFile::getHumanSize(str_replace(' ','',$value));
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
