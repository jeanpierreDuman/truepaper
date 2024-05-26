async function fetchCategories(url = "/api/categories") {
  const response = await fetch("http://localhost:8000" + url);

  const categories = await response.json();

  return categories;
}

async function getCategory(id) {
  const response = await fetch("http://localhost:8000/api/categories/" + id, {
    headers: {
      Accept: "application/json",
    },
  });

  const category = await response.json();

  return category;
}

async function addCategory(category) {
  const response = await fetch("http://localhost:8000/api/categories", {
    method: "POST",
    body: JSON.stringify(category),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return response;
}

async function updateCategory(category) {
  const response = await fetch(
    "http://localhost:8000/api/categories/" + category.id,
    {
      method: "PUT",
      body: JSON.stringify(category),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return response;
}

async function removeCategory(id) {
  const response = await fetch("http://localhost:8000/api/categories/" + id, {
    method: "DELETE",
  });

  return response;
}

export {
  fetchCategories,
  getCategory,
  addCategory,
  updateCategory,
  removeCategory,
};
