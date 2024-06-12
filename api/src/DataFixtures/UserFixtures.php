<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private $userPasswordHasherInterface;

    public function __construct(UserPasswordHasherInterface $userPasswordHasherInterface)
    {
        $this->userPasswordHasherInterface = $userPasswordHasherInterface;
    }

    public function load(ObjectManager $manager): void
    {
        $user1 = new User();
        $user1->setEmail('duman.jeanpierre@gmail.com');
        $user1->setPassword($this->userPasswordHasherInterface->hashPassword($user1, 'bebeto'));

        $user2 = new User();
        $user2->setEmail('test@test.test');
        $user2->setPassword($this->userPasswordHasherInterface->hashPassword($user2, 'test'));

        $manager->persist($user1);
        $manager->persist($user2);
        $manager->flush();
    }
}
