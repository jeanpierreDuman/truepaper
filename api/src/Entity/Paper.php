<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\PaperRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: PaperRepository::class)]
#[ApiResource(
    paginationItemsPerPage: 10,
    normalizationContext: ['groups' => 'paper:read'],
    denormalizationContext:['groups' => 'paper:write']
)]
#[ApiFilter(OrderFilter::class, properties: ['id'], arguments: ['orderParameterName' => 'order'])]
#[ApiFilter(SearchFilter::class, properties: [
    'category.name' => 'exact'
])]
class Paper
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['paper:read', 'paper:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['paper:read', 'paper:write'])]
    #[Assert\NotBlank()]
    #[Assert\NotNull()]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['paper:read', 'paper:write'])]
    #[Assert\NotBlank()]
    #[Assert\NotNull()]
    private ?string $content = null;

    #[ORM\ManyToOne(inversedBy: 'papers')]
    #[Groups(['paper:read', 'paper:write'])]
    private ?Category $category = null;

    #[ORM\OneToMany(mappedBy: 'paper', targetEntity: Source::class)]
    private Collection $sources;

    public function __construct()
    {
        $this->sources = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    /**
     * @return Collection<int, Source>
     */
    public function getSources(): Collection
    {
        return $this->sources;
    }

    public function addSource(Source $source): static
    {
        if (!$this->sources->contains($source)) {
            $this->sources->add($source);
            $source->setPaper($this);
        }

        return $this;
    }

    public function removeSource(Source $source): static
    {
        if ($this->sources->removeElement($source)) {
            // set the owning side to null (unless already changed)
            if ($source->getPaper() === $this) {
                $source->setPaper(null);
            }
        }

        return $this;
    }
}
