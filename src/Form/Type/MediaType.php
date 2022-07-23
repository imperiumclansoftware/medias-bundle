<?php

namespace ICS\MediaBundle\Form\Type;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormBuilderInterface;
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

class MediaType extends AbstractType
{
    private $transformer;
    private $service;

    public function __construct(MediaTransformer $mediaTransformer, MediaService $mediaService)
    {
        $this->transformer = $mediaTransformer;
        $this->service=$mediaService;
    }

    public function getParent(): string
    {    
        return FileType::class;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $this->transformer->setRequired($options['required']);
        $this->transformer->setOutputdir($options['outputdir']);

        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) use ($builder) {
            $data = $event->getData();
            $this->transformer->setOldValue($data);
        });

        $builder->addModelTransformer($this->transformer);
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        if($options['maxFileSize'] <= $this->service->getMaxUploadSize())
        {
            $view->vars['help']="Max file size : ".MediaFile::getHumanSize($options['maxFileSize']).'.';
        }
        else
        {
            $view->vars['help']="Max file size : ".MediaFile::getHumanSize($this->service->getMaxUploadSize()).'.';
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
        $view->vars["multiple"] = false;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
            $resolver->setDefaults([
                'data_class' => MediaFile::class,
                'outputdir' => 'upload',
                'acceptedFiles' => [],
                'maxFileSize' => $this->service->getMaxUploadSize(),
            ]);
    }

    public function getBlockPrefix()
    {
        return "media";
    }
}
