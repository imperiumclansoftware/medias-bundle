<?php
namespace ICS\MediaBundle\Repository;

//use SDI\FormextensionsBundle\Interfaces\AutoCompletionInterface;
use Doctrine\ORM\EntityRepository;

class MediaFileRepository extends EntityRepository //implements AutoCompletionInterface
{
    public function searchAutocomplete($search)
    {
        return $this->createQueryBuilder('u')

            ->where('lower(u.path) LIKE lower(:qui)')
            ->orderBy("u.path","ASC")
            ->setParameter('qui', '%' . $search . '%')
            ->getQuery()
            ->getResult();
    }
}