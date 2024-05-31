<?php

namespace App\Controller;

use App\Entity\MediaObject;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class CreateMediaObjectController extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManagerInterface)
    {
    }

    public function __invoke(Request $request)
    {
        $folder = $this->getParameter('media_directory');

        $picture = $request->files->get('image');

        $newFilename = uniqid().'.'.$picture->guessExtension();

        try {
            $picture->move($folder, $newFilename);
        } catch (FileException $e) {
        }

        $mediaO = new MediaObject();
        $mediaO->setFile($folder . '/' . $newFilename);
        $this->entityManagerInterface->persist($mediaO);
        $this->entityManagerInterface->flush();

        dd("media upload ;)");
    }
}