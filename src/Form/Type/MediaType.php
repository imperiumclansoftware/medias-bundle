<?php

/**
 * Form control for media management
 *
 * @author David Dutas <david.dutasàia.defensecdd.gouv.fr>
 */

namespace ICS\MediaBundle\Form\Type;

use ICS\MediaBundle\Entity\MediaFile;
use ICS\MediaBundle\Form\DataTransformer\MediaTransformer;
use ICS\MediaBundle\Service\MediaService;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MediaType extends AbstractType
{
    private $transformer;

    public function __construct(MediaTransformer $transformer)
    {
        $this->transformer = $transformer;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->addModelTransformer($this->transformer);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'invalid_message' => "File can't be upload",
        ]);
    }

    public function getParent(): string
    {
        return FileType::class;
    }
}
