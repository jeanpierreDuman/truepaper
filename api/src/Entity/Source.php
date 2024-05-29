<?php

namespace App\Entity;

use App\Repository\SourceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource()]
#[ORM\Entity(repositoryClass: SourceRepository::class)]
class Source
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToMany(mappedBy: 'source', targetEntity: Picture::class)]
    private Collection $pictures;

    #[Groups(['paper:read', 'paper:write'])]
    #[ORM\OneToMany(mappedBy: 'source', targetEntity: Link::class, cascade: ['persist', 'remove'], orphanRemoval:true)]
    private Collection $links;

    #[ORM\OneToMany(mappedBy: 'source', targetEntity: Paper::class)]
    private Collection $papers;

    public function __construct()
    {
        $this->pictures = new ArrayCollection();
        $this->links = new ArrayCollection();
        $this->papers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Picture>
     */
    public function getPictures(): Collection
    {
        return $this->pictures;
    }

    public function addPicture(Picture $picture): static
    {
        if (!$this->pictures->contains($picture)) {
            $this->pictures->add($picture);
            $picture->setSource($this);
        }

        return $this;
    }

    public function removePicture(Picture $picture): static
    {
        if ($this->pictures->removeElement($picture)) {
            // set the owning side to null (unless already changed)
            if ($picture->getSource() === $this) {
                $picture->setSource(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Link>
     */
    public function getLinks(): Collection
    {
        return $this->links;
    }

    public function addLink(Link $link): static
    {
        if (!$this->links->contains($link)) {
            $this->links->add($link);
            $link->setSource($this);
        }

        return $this;
    }

    public function removeLink(Link $link): static
    {
        if ($this->links->removeElement($link)) {
            // set the owning side to null (unless already changed)
            if ($link->getSource() === $this) {
                $link->setSource(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Paper>
     */
    public function getPapers(): Collection
    {
        return $this->papers;
    }

    public function addPaper(Paper $paper): static
    {
        if (!$this->papers->contains($paper)) {
            $this->papers->add($paper);
            $paper->setSource($this);
        }

        return $this;
    }

    public function removePaper(Paper $paper): static
    {
        if ($this->papers->removeElement($paper)) {
            // set the owning side to null (unless already changed)
            if ($paper->getSource() === $this) {
                $paper->setSource(null);
            }
        }

        return $this;
    }
}
