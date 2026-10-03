document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    event.preventDefault();
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const currentYear = new Date().getFullYear();
const footer = document.querySelector('footer');
if (footer) {
  footer.innerHTML = `
    <b>Manjit Singh</b>
    <span>Senior Android Developer · Kotlin · Java · Jetpack Compose</span>
    <span>© ${currentYear} Manjit Singh</span>
  `;
}
