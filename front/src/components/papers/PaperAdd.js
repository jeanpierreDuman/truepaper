import { useState } from "react";
import { addPaper } from "../../requests/papersRequest";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";

export default function PaperAdd() {
  const [paper, setPaper] = useState({
    title: "",
    content: "",
  });

  const navigate = useNavigate();

  const sendFormPaper = (e) => {
    e.preventDefault();

    addPaper(paper).then((response) => {
      if (response.ok === true) {
        navigate("/");
      }
    });
  };

  return (
    <div>
      <div>
        <h2>Créer un papier</h2>
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
