import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Placeholder from "react-bootstrap/Placeholder";
import { fetchPapers, removePaper } from "../../requests/papersRequest";
import { fetchCategories } from "../../requests/categoryRequest";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
//import parse from "html-react-parser";

export default function Papers() {
  const [papers, setPapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    order: "DESC",
    category: "",
  });

  useEffect(() => {
    fetchCategories().then((categories) => {
      setCategories(categories["hydra:member"]);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchPapers("/api/papers", filters).then((papers) => {
      setPapers(papers["hydra:member"]);
      if (papers["hydra:view"] !== undefined) {
        setPagination(papers["hydra:view"]);
      }
      setIsLoading(false);
    });
  }, [filters]);

  const handleChangeFilters = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const deletePaper = (id) => {
    removePaper(id).then((response) => {
      if (response.ok === true) {
        setPapers(papers.filter((paper) => paper.id !== id));
      }
    });
  };

  const navigate = useNavigate();

  const moveToPaperEditPage = (id) => {
    navigate("/paper/" + id + "/edit");
  };

  const loadNextPapers = () => {
    if (pagination["hydra:next"] !== undefined) {
      fetchPapers(pagination["hydra:next"], filters).then((currentPapers) => {
        setPapers([...papers, ...currentPapers["hydra:member"]]);
        setPagination(currentPapers["hydra:view"]);
      });
    }
  };

  return (
    <div>
      <div className="pb-3">
        <Link to="/paper/add">
          <Button>Créer un papier</Button>
        </Link>
      </div>
      <div className="form-filter mb-3">
        <Form.Select
          style={{ width: 150 }}
          value={filters.order}
          onChange={handleChangeFilters}
          name="order"
        >
          <option value={"ASC"}>Id : ASC</option>
          <option value={"DESC"}>Id : DESC</option>
        </Form.Select>
        <Form.Select
          onChange={handleChangeFilters}
          style={{ width: 200 }}
          value={filters.category}
          name="category"
        >
          <option value={""} />
          {categories.map((category, index) => {
            return (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            );
          })}
        </Form.Select>
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
      ) : papers.length === 0 ? (
        <div>No more papers</div>
      ) : (
        <div>
          {papers.map((paper, index) => {
            return (
              <Card key={index} className="custom-card">
                <Card.Body>
                  <Card.Title>{paper.title}</Card.Title>
                  <Card.Text
                    dangerouslySetInnerHTML={{ __html: paper.content }}
                  />

                  {paper.category !== undefined && paper.category !== null && (
                    <Badge bg="dark">{paper.category.name}</Badge>
                  )}
                  <div className="card-button">
                    <Button
                      className="card-button-item"
                      variant="warning"
                      onClick={() => moveToPaperEditPage(paper.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="card-button-item"
                      variant="danger"
                      onClick={() => deletePaper(paper.id)}
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
              <Button
                variant="secondary"
                onClick={() => {
                  loadNextPapers();
                }}
              >
                Charger
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
