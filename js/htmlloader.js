async function loadHTML(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}

// Load layout components
document.addEventListener("DOMContentLoaded", async () => {
//   await loadHTML("header", "layouts/header.html");
//   await loadHTML("sidebar", "layouts/sidebar.html");

  // Default page
  loadHTML("main-content", "pages/dashboard.html");

  // Delegate click events (after sidebar is loaded)
  document.getElementById("sidebar").addEventListener("click", (e) => {
    const target = e.target.closest("a[data-page]");
    if (target) {
      e.preventDefault();
      const page = target.getAttribute("data-page");
      loadHTML("main-content", `pages/${page}`);
    }
  });
});
