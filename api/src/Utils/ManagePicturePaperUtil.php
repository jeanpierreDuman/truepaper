<?php 

namespace App\Utils;

use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ManagePicturePaperUtil 
{
    private $mediaDirectory;

    public function __construct(
        private EntityManagerInterface $entityManagerInterface,
        private ParameterBagInterface $parameterBagInterface
        )
    {
        $this->mediaDirectory = $this->parameterBagInterface->get('media_directory');
    }

    public function isBase64String($string) {
        return str_contains($string, ";base64");
    }

    public function uploadBase64($aPictures) {
        foreach($aPictures as $picture) {
            $base64_img = $picture->getFile();

            if($this->isBase64String($base64_img)) {
                $split = explode(',', substr($base64_img, 5), 2);
                $mime = $split[0];
                $img_data = $split[1];
                $mime_split_without_base64 = explode(';', $mime, 2);
                $mime_split = explode('/', $mime_split_without_base64[0], 2);
                
                if (count($mime_split) == 2) {
                    // get file extension
                    $extension = $mime_split[1];
                    // decode base64 string
                    $decoded = base64_decode($img_data);
                    // create filename
                    $filename = uniqid() . '.' . $extension;
                    // returns falsy if unsuccessful
                    file_put_contents($this->mediaDirectory . '/' . $filename, $decoded);
    
                    $picture->setFile($this->mediaDirectory . '/' . $filename);
                }
                
                $picture->setDateUpdate(new DateTime('now'));

                $this->entityManagerInterface->persist($picture);
            }
        }
    }

    public function removePictureAndFile($aPictures) {
        foreach($aPictures as $picture) {
            $picturePath = str_replace("/", "\\", $picture->getFile());
            if(file_exists($picturePath)) {
                unlink($picturePath);
                $this->entityManagerInterface->remove($picture);
            }
        }
    }
}