import Button from "react-bootstrap/esm/Button";

export default function PictureForm({
  picture,
  index,
  setOnChangePicture,
  deletePicture,
}) {
  return (
    <div className="form-link">
      <p>
        Nom :{" "}
        <input
          type="text"
          value={picture.name}
          className="form-control"
          name="name"
          onChange={(e) => {
            setOnChangePicture(e, index);
          }}
        />
        Image :
        <input
          type="file"
          className="form-control"
          name="file"
          onChange={(e) => {
            setOnChangePicture(e, index);
          }}
        />
      </p>
      <div className="action">
        <Button variant="danger" size="sm" onClick={() => deletePicture(index)}>
          Supprimer le lien
        </Button>
      </div>
    </div>
  );
}
