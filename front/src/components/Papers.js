import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Placeholder from "react-bootstrap/Placeholder";
import {
  fetchPapers,
  addPaper,
  updatePaper,
  removePaper,
} from "./../requests/papersRequest";

export default function Papers() {
  const [papers, setPapers] = useState([]);
  const [isPapersLoading, setIsPapersLoading] = useState(false);
  const [selectPaperToUpdate, setSelectPaperToUpdate] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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

    let paper = {
      title: title,
      content: content,
    };

    if (selectPaperToUpdate !== null) {
      updatePaper(selectPaperToUpdate).then((response) => {
        if (response.ok === true) {
          let newPapers = papers.map((paper) => {
            if (paper.id === selectPaperToUpdate.id) {
              paper.title = title;
              paper.content = content;
            }
            return paper;
          });
          setPapers(newPapers);

          setSelectPaperToUpdate(null);
          setTitle("");
          setContent("");
        }
      });
    } else {
      addPaper(paper).then((response) => {
        if (response.ok === true) {
          let lastPaper = papers[papers.length - 1];
          let lastId = 1;
          if (lastPaper !== undefined) {
            lastId = lastPaper.id + 1;
          }

          paper.id = lastId;

          setPapers([...papers, paper]);
          setTitle("");
          setContent("");
        }
      });
    }
  };

  const editPaper = (paper) => {
    setTitle(paper.title);
    setContent(paper.content);
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </p>
          <p>
            Content :{" "}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </p>
          <button>send</button>
        </form>
      </div>
      <hr />
      {isPapersLoading === true ? (
        <Placeholder as="p" animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
      ) : papers.length === 0 ? (
        <div>No more papers</div>
      ) : (
        papers.map((paper, index) => {
          return (
            <div key={index}>
              <p>Title : {paper.title}</p>
              <p>Content : {paper.content}</p>
              <Button onClick={() => editPaper(paper)}>Edit</Button>
              <Button onClick={() => deletePaper(paper.id)}>Delete</Button>
            </div>
          );
        })
      )}
    </div>
  );
}
