import Button from "react-bootstrap/esm/Button";

export default function LinkForm({ link, index, setOnChangeLink, deleteLink }) {
  return (
    <div className="form-link">
      <p>
        Nom :{" "}
        <input
          type="text"
          value={link.name}
          className="form-control"
          name="name"
          onChange={(e) => {
            setOnChangeLink(e, index);
          }}
        />
        Url :
        <input
          type="text"
          value={link.url}
          className="form-control"
          name="url"
          onChange={(e) => {
            setOnChangeLink(e, index);
          }}
        />
      </p>
      <div className="action">
        <Button variant="danger" size="sm" onClick={() => deleteLink(index)}>
          Supprimer le lien
        </Button>
      </div>
    </div>
  );
}
