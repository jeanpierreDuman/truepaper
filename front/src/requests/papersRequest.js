async function fetchPapers() {
  const response = await fetch("http://localhost:8000/api/papers", {
    headers: {
      Accept: "application/json",
    },
  });

  const papers = await response.json();
  return papers;
}

async function addPaper(paper) {
  const response = await fetch("http://localhost:8000/api/papers", {
    method: "POST",
    body: JSON.stringify(paper),
    headers: {
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

export { fetchPapers, addPaper, updatePaper, removePaper };
