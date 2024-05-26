import { useEffect, useState } from "react";
import {
  fetchCategories,
  removeCategory,
} from "./../../requests/categoryRequest";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Placeholder from "react-bootstrap/Placeholder";
import { Link, useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetchCategories().then((categories) => {
      setCategories(categories["hydra:member"]);
      if (categories["hydra:view"] !== undefined) {
        setPagination(categories["hydra:view"]);
      }
      setIsLoading(false);
    });
  }, []);

  const moveToCategoryEditPage = (id) => {
    navigate("/category/" + id + "/edit");
  };

  const deleteCategory = (id) => {
    removeCategory(id).then((response) => {
      if (response.ok === true) {
        setCategories(categories.filter((category) => category.id !== id));
      }
    });
  };

  return (
    <div>
      <div className="pb-3">
        <Link to="/category/add">
          <Button>Créer une catégorie</Button>
        </Link>
      </div>
      {isLoading === true ? (
        <div>
          {[1, 2, 3].map((index) => {
            return (
              <Card className="mt-4" key={index}>
                <Card.Body>
                  <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={4} />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                    <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                    <Placeholder xs={8} />
                  </Placeholder>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      ) : categories.length === 0 ? (
        <div>No more categories</div>
      ) : (
        <div>
          {categories.map((category, index) => {
            return (
              <Card key={index} className="custom-card">
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                  <Badge bg="dark">{category.papers.length}</Badge>
                  <div className="card-button">
                    <Button
                      className="card-button-item"
                      variant="warning"
                      onClick={() => {
                        moveToCategoryEditPage(category.id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      className="card-button-item"
                      variant="danger"
                      onClick={() => {
                        deleteCategory(category.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
          <div className="text-align-center">
            {pagination["hydra:next"] !== undefined && (
              <Button variant="secondary" onClick={() => {}}>
                Charger
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
