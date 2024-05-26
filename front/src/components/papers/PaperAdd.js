import { useEffect, useState } from "react";
import { addPaper } from "../../requests/papersRequest";
import { fetchCategories } from "../../requests/categoryRequest";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";

export default function PaperAdd() {
  const [paper, setPaper] = useState({
    title: "",
    content: "",
    category: {},
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data["hydra:member"]);
    });
  }, []);

  const navigate = useNavigate();

  const sendFormPaper = (e) => {
    e.preventDefault();

    addPaper(paper).then((response) => {
      if (response.ok === true) {
        navigate("/");
      }
    });
  };

  const changeCategory = (e) => {
    let category = null;
    let id = e.target.value;
    if (id.length !== 0) {
      let categoryFind = categories.find(
        (category) => category.id === Number(id)
      );
      category = { id: categoryFind.id, name: categoryFind.name };
    }

    setPaper({ ...paper, category: category });
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
            <Form.Select
              onChange={changeCategory}
              value={
                paper.category !== undefined && paper.category !== null
                  ? paper.category.id
                  : ""
              }
            >
              <option key={null} value={""}></option>
              {categories.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </Form.Select>
          </p>
          <Button type="submit">Envoyer</Button>
        </form>
      </div>
    </div>
  );
}
