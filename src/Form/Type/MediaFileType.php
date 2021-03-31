<?php

/**
 * Form control for media management
 *
 * @author David Dutas <david.dutasàia.defensecdd.gouv.fr>
 */

namespace ICS\MediaBundle\Form\Type;

use Liip\ImagineBundle\Form\Type\ImageType;
use ICS\MediaBundle\Entity\MediaFile;
use ICS\MediaBundle\Entity\MediaImage;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MediaFileType extends AbstractType
{

    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        switch ($options['dataclass']) {
            case MediaFile::class:
                $builder->add('path', FileType::class, array());
                break;
            case MediaImage::class:
                $builder->add('path', ImageType::class, array(
                    'image_filter' => 'mediaBundleThumbnail',
                    'image_path' => 'medias'
                ));
                break;
        }
    }


    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'dataclass' => MediaFile::class
        ]);
    }
}
