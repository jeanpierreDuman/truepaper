import { addPaper, updatePaper } from "../../requests/papersRequest";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPaper } from "../../requests/papersRequest";
import { fetchCategories } from "../../requests/categoryRequest";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import LinkForm from "../links/LinkForm";
import PictureForm from "../pictures/PictureForm";

export default function PaperForm({ type = "add" }) {
  const [paper, setPaper] = useState({
    title: "",
    content: "",
    category: null,
    links: [],
    pictures: [],
  });

  const initialErrorPaperForm = {
    title: "",
    content: "",
  };

  const [onLoadContent, setOnLoadContent] = useState(false);
  const [errorPaperForm, setErrorPaperForm] = useState(initialErrorPaperForm);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data["hydra:member"]);
    });

    if (type === "edit") {
      getPaper(id).then((data) => {
        setPaper(data);
      });
    }
  }, [id, type]);

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

  const changeContent = (editor) => {
    if (type === "add") {
      setPaper({ ...paper, content: editor.getData() });
    } else {
      if (onLoadContent === true)
        setPaper({ ...paper, content: editor.getData() });
    }

    setOnLoadContent(true);
  };

  const sendFormPaper = (e) => {
    e.preventDefault();

    let funcPaperAddOrEdit = "";
    if (type === "edit") {
      funcPaperAddOrEdit = updatePaper(paper);
    } else {
      funcPaperAddOrEdit = addPaper(paper);
    }

    funcPaperAddOrEdit.then((response) => {
      if (response.ok === true) {
        navigate("/");
      } else {
        response.json().then((err) => {
          if (err.violations !== undefined) {
            let errorForm = initialErrorPaperForm;
            err.violations.forEach((errViolation) => {
              if (
                Object.keys(errorPaperForm).includes(errViolation.propertyPath)
              ) {
                errorForm[errViolation.propertyPath] = errViolation.message;
              }
            });

            setErrorPaperForm(errorForm);
          }
        });
      }
    });
  };

  const addLink = () => {
    setPaper({ ...paper, links: [...paper.links, { name: "", url: "" }] });
  };

  const addPicture = () => {
    setPaper((prevPaper) => {
      return {
        ...prevPaper,
        pictures: [...paper.pictures, { name: "", file: "" }],
      };
    });
  };

  const setOnChangeLink = (e, index) => {
    let links = paper.links.map((link, indexLoop) => {
      if (index === indexLoop) {
        link[e.target.name] = e.target.value;
      }
      return link;
    });

    setPaper((prevPaper) => {
      return {
        ...prevPaper,
        links: links,
      };
    });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const setOnChangePicture = (e, index) => {
    let pictures = paper.pictures.map((picture, indexLoop) => {
      if (index === indexLoop) {
        if (e.target.name === "file") {
          let fileBase64 = toBase64(e.target.files[0]);
          fileBase64.then((data) => {
            picture[e.target.name] = data.toString();
          });
        } else {
          picture[e.target.name] = e.target.value;
        }
      }
      return picture;
    });

    setPaper((prevPaper) => {
      return {
        ...prevPaper,
        pictures: pictures,
      };
    });
  };

  const deletePicture = (index) => {
    let pictures = paper.pictures.filter(
      (picture, indexLoop) => indexLoop !== index
    );
    setPaper((prevPaper) => {
      return {
        ...prevPaper,
        pictures: pictures,
      };
    });
  };

  const deleteLink = (index) => {
    let links = paper.links.filter((link, indexLoop) => indexLoop !== index);
    setPaper((prevPaper) => {
      return {
        ...prevPaper,
        links: links,
      };
    });
  };

  return (
    <div>
      <form onSubmit={sendFormPaper}>
        <div className="div-form">
          <h2>{type === "add" ? "Ajouter un papier" : "Editer un papier"}</h2>
          <div>
            <Form.Label htmlFor="title">Titre :</Form.Label>
            <Form.Control
              value={paper.title}
              onChange={(e) => setPaper({ ...paper, title: e.target.value })}
              type="text"
              id="title"
            />
            <span className="error">{errorPaperForm.title}</span>
          </div>
          <div className="mt-4">
            <CKEditor
              id="content"
              editor={ClassicEditor}
              data={paper.content}
              onChange={(event, editor) => changeContent(editor)}
            />
            <span className="error">{errorPaperForm.content}</span>
          </div>
          <div className="mt-4">
            <Form.Label htmlFor="category">Categorie :</Form.Label>
            <Form.Select
              id="category"
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
                  <option key={category["@id"]} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </Form.Select>
          </div>
        </div>
        <div className="div-form mt-2">
          <h5>Liens</h5>
          <div className="text-center">
            <Button onClick={() => addLink()}>Ajouter un lien</Button>
          </div>
          {paper.links.map((link, index) => {
            return (
              <div key={index}>
                <LinkForm
                  link={link}
                  index={index}
                  setOnChangeLink={setOnChangeLink}
                  deleteLink={deleteLink}
                />
              </div>
            );
          })}
        </div>
        <div className="div-form mt-2">
          <h5>Images</h5>
          <div className="text-center">
            <Button onClick={() => addPicture()}>Ajouter une image</Button>
          </div>

          {paper.pictures.map((picture, index) => {
            return (
              <div key={index}>
                <PictureForm
                  picture={picture}
                  index={index}
                  setOnChangePicture={setOnChangePicture}
                  deletePicture={deletePicture}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <Button type="submit">Envoyer</Button>
        </div>
      </form>
    </div>
  );
}
