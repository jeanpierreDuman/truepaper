import { useEffect, useState } from "react";
import { addPaper } from "../../requests/papersRequest";
import { useNavigate, useParams } from "react-router-dom";
import { getPaper, updatePaper } from "../../requests/papersRequest";
import Button from "react-bootstrap/esm/Button";

export default function PaperEdit() {
  const [paper, setPaper] = useState({
    title: "",
    content: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getPaper(id).then((data) => {
      setPaper(data);
    });
  }, []);

  const sendFormPaper = (e) => {
    e.preventDefault();

    updatePaper(paper).then((response) => {
      if (response.ok === true) {
        navigate("/");
      }
    });
  };

  return (
    <div>
      <div>
        <h2>Editer un papier</h2>
        <form onSubmit={sendFormPaper}>
          <p>
            Titre :{" "}
            <input
              type="text"
              value={paper.title}
              onChange={(e) => setPaper({ ...paper, title: e.target.value })}
            />
          </p>
          <p>
            Contenu : <br />
            <textarea
              value={paper.content}
              onChange={(e) => setPaper({ ...paper, content: e.target.value })}
            />
          </p>
          <Button>Envoyer</Button>
        </form>
      </div>
    </div>
  );
}
