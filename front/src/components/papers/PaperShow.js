import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPaper } from "../../requests/papersRequest";
import Badge from "react-bootstrap/Badge";

export default function PaperShow() {
  const { id } = useParams();
  const [paper, setPaper] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getPaper(id).then((data) => {
      setPaper(data);
      setIsLoading(false);
    });
  }, [id]);

  return (
    <>
      <div className="div-form">
        <h2>{paper.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: paper.content }} />
        <div>
          {paper.category !== undefined && paper.category !== null && (
            <Badge bg="dark" className="mt-3">
              {paper.category.name}
            </Badge>
          )}
        </div>
      </div>
      <div className="div-form mt-3">
        <h2>Liens</h2>
        {isLoading === true ? (
          <div>on charge</div>
        ) : (
          <div>
            {paper.links !== undefined && paper.links.length !== 0 ? (
              paper.links.map((link, index) => {
                return (
                  <p key={index}>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.name}
                    </a>
                  </p>
                );
              })
            ) : (
              <div>Aucun lien</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
