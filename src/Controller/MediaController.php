<?php
namespace ICS\MediaBundle\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use ICS\MediaBundle\Service\MediaService;
use Doctrine\ORM\EntityManagerInterface;

class MediaController extends AbstractController
{
    /**
     *
     * @Route("/upload",name="ics-medias-upload-multiple")
     */
    public function upload(Request $request, EntityManagerInterface $em,KernelInterface $kernel, MediaService $mediaService)
    {
        $media = $request->files->get('file');
        $basePath=$kernel->getProjectDir().'/temp/dropbox';
        $type=$mediaService->getMediaType($media->getPathName());
        if(!file_exists($basePath))
        {
            mkdir($basePath,0777,true);
            
        }
        $newPath=$basePath."/".$media->getClientOriginalName();
        move_uploaded_file($media->getPathName(),$newPath);

        //infos sur le document envoyé
        //var_dump($request->files->get('file'));die;
        return new JsonResponse(array('success' => true,'path' => $newPath));
        
    }

}