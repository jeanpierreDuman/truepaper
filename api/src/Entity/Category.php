<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
#[ApiResource(
    paginationItemsPerPage: 10,
    normalizationContext: ['groups' => ['category:read']],
)]
class Category
{
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['paper:read', 'category:read'])]
    private ?int $id = null;

    #[Groups(['paper:read', 'paper:write', 'category:read'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Groups(['category:read'])]
    #[ORM\OneToMany(mappedBy: 'category', targetEntity: Paper::class)]
    private Collection $papers;

    public function __construct()
    {
        $this->papers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

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
            $paper->setCategory($this);
        }

        return $this;
    }

    public function removePaper(Paper $paper): static
    {
        if ($this->papers->removeElement($paper)) {
            // set the owning side to null (unless already changed)
            if ($paper->getCategory() === $this) {
                $paper->setCategory(null);
            }
        }

        return $this;
    }
}
