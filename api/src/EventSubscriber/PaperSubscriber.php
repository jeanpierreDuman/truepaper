<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Paper;
use App\Repository\PictureRepository;
use App\Utils\ManagePicturePaperUtil;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class PaperSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private ManagePicturePaperUtil $managePicturePaperUtil,
        private PictureRepository $pictureRepository)
    {}

    public function onActionPaper(ViewEvent $event): void
    {
        $entity = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        // When we create Paper
        if($entity instanceof Paper && (Request::METHOD_POST === $method)) {
            $this->managePicturePaperUtil->uploadBase64($entity->getPictures());
        }

        // When we update Paper
        if($entity instanceof Paper && (Request::METHOD_PUT === $method)) {
            $oldPictureFile = $this->pictureRepository->getPreviousPicture($entity->getId());

            $currentPictureFile = array_map(function ($picture) {
                return $picture->getFile();
            }, $entity->getPictures()->toArray());

            $pictureToRemove = $this->pictureRepository->findByFile(array_diff($oldPictureFile, $currentPictureFile));

            $this->managePicturePaperUtil->removePictureAndFile($pictureToRemove);
            $this->managePicturePaperUtil->uploadBase64($entity->getPictures());
        }

        // When we delete Paper
        if($entity instanceof Paper && (Request::METHOD_DELETE === $method)) {
            $this->managePicturePaperUtil->removePictureAndFile($entity->getPictures());
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['onActionPaper', EventPriorities::PRE_WRITE],
        ];
    }
}
