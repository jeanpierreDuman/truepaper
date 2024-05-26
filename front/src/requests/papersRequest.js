async function fetchPapers(url = "/api/papers") {
  const response = await fetch("http://localhost:8000" + url);

  const papers = await response.json();

  return papers;
}

async function getPaper(id) {
  const response = await fetch("http://localhost:8000/api/papers/" + id, {
    headers: {
      Accept: "application/json",
    },
  });

  const paper = await response.json();

  return paper;
}

async function addPaper(paper) {
  const response = await fetch("http://localhost:8000/api/papers", {
    method: "POST",
    body: JSON.stringify(paper),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return response;
}

async function updatePaper(paper) {
  const response = await fetch("http://localhost:8000/api/papers/" + paper.id, {
    method: "PUT",
    body: JSON.stringify(paper),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return response;
}

async function removePaper(id) {
  const response = await fetch("http://localhost:8000/api/papers/" + id, {
    method: "DELETE",
  });

  return response;
}

export { fetchPapers, getPaper, addPaper, updatePaper, removePaper };
