import {
  addCategory,
  getCategory,
  updateCategory,
} from "../../requests/categoryRequest";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function CategoryForm({ type = "add" }) {
  const [category, setCategory] = useState({ name: "" });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (type === "edit") {
      getCategory(id).then((data) => {
        setCategory(data);
      });
    }
  }, [id, type]);

  const sendFormCategory = (e) => {
    e.preventDefault();

    let funcCategoryAddOrEdit = "";
    if (type === "edit") {
      funcCategoryAddOrEdit = updateCategory(category);
    } else {
      funcCategoryAddOrEdit = addCategory(category);
    }

    funcCategoryAddOrEdit.then((response) => {
      if (response.ok === true) {
        navigate("/categories");
      }
    });
  };

  return (
    <div className="div-form">
      <h2>
        {type === "add" ? "Ajouter une catégorie" : "Editer une catégorie"}
      </h2>
      <form onSubmit={sendFormCategory}>
        <div>
          <Form.Label htmlFor="name">Nom :</Form.Label>
          <Form.Control
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            type="text"
            id="name"
          />
        </div>
        <div className="mt-4">
          <Button type="submit">Envoyer</Button>
        </div>
      </form>
    </div>
  );
}
