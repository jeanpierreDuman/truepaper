import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Placeholder from "react-bootstrap/Placeholder";
import { fetchPapers, removePaper } from "../../requests/papersRequest";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";

export default function Papers() {
  const [papers, setPapers] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchPapers().then((papers) => {
      setPapers(papers["hydra:member"]);
      if (papers["hydra:view"] !== undefined) {
        setPagination(papers["hydra:view"]);
      }
      setIsLoading(false);
    });
  }, []);

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
      fetchPapers(pagination["hydra:next"]).then((currentPapers) => {
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
                  <Card.Text>{paper.content}</Card.Text>
                  {paper.category !== undefined && (
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
