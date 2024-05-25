import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Placeholder from "react-bootstrap/Placeholder";
import {
  fetchPapers,
  addPaper,
  updatePaper,
  removePaper,
} from "./../requests/papersRequest";
import Card from "react-bootstrap/Card";

export default function Papers() {
  const [papers, setPapers] = useState([]);
  const [isPapersLoading, setIsPapersLoading] = useState(false);
  const [selectPaperToUpdate, setSelectPaperToUpdate] = useState(null);
  const [paper, setPaper] = useState({
    title: "",
    content: "",
  });

  const initializePaper = () => {
    setPaper({ title: "", content: "" });
  };

  useEffect(() => {
    setIsPapersLoading(true);
    fetchPapers().then((papers) => {
      setPapers(papers);
      setIsPapersLoading(false);
    });
  }, []);

  const deletePaper = (id) => {
    removePaper(id).then((response) => {
      if (response.ok === true) {
        setPapers(papers.filter((paper) => paper.id !== id));
      }
    });
  };

  const sendFormPaper = (e) => {
    e.preventDefault();

    if (selectPaperToUpdate !== null) {
      updatePaper(selectPaperToUpdate).then((response) => {
        if (response.ok === true) {
          let paperUpdated = paper;
          let newPapers = papers.map((paper) => {
            if (paper.id === selectPaperToUpdate.id) {
              paper.title = paperUpdated.title;
              paper.content = paperUpdated.content;
            }
            return paper;
          });
          setPapers(newPapers);

          setSelectPaperToUpdate(null);
          initializePaper();
        }
      });
    } else {
      addPaper(paper).then((response) => {
        if (response.ok === true) {
          response.json().then((data) => {
            paper.id = data.id;
            setPapers([...papers, paper]);
          });

          initializePaper();
        }
      });
    }
  };

  const editPaper = (paper) => {
    setPaper({ title: paper.title, content: paper.content });
    setSelectPaperToUpdate(paper);
  };

  return (
    <div>
      <div>
        <form onSubmit={sendFormPaper}>
          <p>
            Title :{" "}
            <input
              type="text"
              value={paper.title}
              onChange={(e) => setPaper({ ...paper, title: e.target.value })}
            />
          </p>
          <p>
            Content :{" "}
            <textarea
              value={paper.content}
              onChange={(e) => setPaper({ ...paper, content: e.target.value })}
            />
          </p>
          <button>send</button>
        </form>
      </div>
      <hr />
      {isPapersLoading === true ? (
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
        papers.map((paper, index) => {
          return (
            <Card key={index} className="custom-card">
              <Card.Body>
                <Card.Title>{paper.title}</Card.Title>
                <Card.Text>{paper.content}</Card.Text>
                <div className="card-button">
                  <Button
                    className="card-button-item"
                    variant="warning"
                    onClick={() => editPaper(paper)}
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
        })
      )}
    </div>
  );
}
