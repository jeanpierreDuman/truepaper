const API_URL = "http://localhost:8000";

function getParamUrl(url, filters) {
  // Order filter
  url += url.includes("?page") ? "&" : "?";
  url += "order[id]=" + filters.order;

  // Category filter
  if (filters.category !== "") {
    url += "&category.name=" + filters.category;
  }

  return url;
}

async function fetchPapers(
  url = "/api/papers",
  filters = { order: "DESC", category: "" }
) {
  let custormUrl = API_URL + url;
  custormUrl = getParamUrl(custormUrl, filters);

  const response = await fetch(custormUrl);
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
  console.log(paper);
  const response = fetch("http://localhost:8000/api/papers", {
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
