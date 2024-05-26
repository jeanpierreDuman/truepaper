async function fetchCategories(url = "/api/categories") {
  const response = await fetch("http://localhost:8000" + url);

  const categories = await response.json();

  return categories;
}

export { fetchCategories };
