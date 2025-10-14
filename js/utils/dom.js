document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('aside a');
  const content = document.getElementById('main-wrapper');

  // Function to load a page
  async function loadPage(page) {
    try {
      const response = await fetch(`pages/${page}`);
      if (!response.ok) throw new Error('Page not found');
      const html = await response.text();
      content.innerHTML = html;
    } catch (error) {
      content.innerHTML = `<p style="color:red;">Error loading page: ${error.message}</p>`;
    }
  }

  // Attach click events
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = e.target.getAttribute('data-page');
      loadPage(page);
    });
  });
});
