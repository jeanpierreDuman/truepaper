<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Paper;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class PaperSubscriber implements EventSubscriberInterface
{
    private $registry;

    public function __construct(ManagerRegistry $managerRegistry)
    {
        $this->registry = $managerRegistry;
    }

    public function onPutPaper(ViewEvent $event): void
    {
        $entity = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($entity instanceof Paper && (Request::METHOD_PUT === $method)) {

            $em = $this->registry->getManagerForClass(get_class($entity));
            $uow = $em->getUnitOfWork();
            $prev = $uow->getOriginalEntityData($entity);

            $em->remove($prev['source']);
            $em->flush();
        }

        return;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['onPutPaper', EventPriorities::PRE_WRITE],
        ];
    }
}
