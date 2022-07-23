<?php

namespace ICS\MediaBundle\Form\Type;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\AbstractType;
use ICS\MediaBundle\Service\MediaService;
use ICS\MediaBundle\Form\DataTransformer\MediaTransformer;
use ICS\MediaBundle\Form\DataTransformer\MediaCollectionTransformer;
use ICS\MediaBundle\Entity\MediaFile;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

class MediaCollectionType extends AbstractType
{
    private $transformer;
    private $nbElements = 0;
    private $service;

    public function __construct(MediaCollectionTransformer $mediaCollectionTransformer, MediaService $mediaService)
    {
        $this->transformer = $mediaCollectionTransformer;
        $this->service=$mediaService;
    }

    public function getParent(): string
    {
        return  CollectionType::class;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $this->transformer->setRequired($options['required']);
        $this->transformer->setOutputdir($options['outputdir']);

        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) use ($builder) {
            $data = $event->getData();
            $collection = new ArrayCollection();
            if ($data != null) {
                foreach ($data as $dt) {
                    $collection->add($dt);
                }
            }
            $this->nbElements = count($collection);
            $this->transformer->setOldValue($collection);
        });

        $builder->addModelTransformer($this->transformer);
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        if($options['maxFileSize'] <= $this->service->getMaxUploadSize())
        {
            $view->vars['help']="Max size for each file : ".MediaFile::getHumanSize($options['maxFileSize']).'.';
        }
        else
        {
            $view->vars['help']="Max size for each file : ".MediaFile::getHumanSize($this->service->getMaxUploadSize()).'.';
        }
        
        if(count($options["acceptedFiles"]) > 0)
        {
            $view->vars['help'].=' Accepted files :';

            foreach($options["acceptedFiles"] as $accepted)
            {
                $view->vars['help'].=' '.$accepted.',';
            }

            $view->vars['help'][strlen($view->vars['help'])-1]='.';
            
        }
        $view->vars['acceptedFiles'] = $options["acceptedFiles"];
        $view->vars["multiple"] = true;
        $view->vars['nbElements'] = $this->nbElements;
        $view->vars["maxFileSize"]= $options['maxFileSize'];
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Collection::class,
            'outputdir' => 'upload',
            'prototype' => true,
            "entry_type" => HiddenType::class,
            'allow_add' => true,
            'allow_delete' => true,
            'delete_empty' => true,
            'acceptedFiles' => [],
            'maxFileSize' => $this->service->getMaxUploadSize(),
        ]);
    }

    public function getBlockPrefix()
    {
        return "media";
    }
}
