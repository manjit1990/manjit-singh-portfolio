const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('is-open', !expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.add('reveal');
    revealObserver.observe(section);
  });
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigation.querySelectorAll('a').forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-10% 0px -65% 0px' });
  document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));
}
const footer = document.querySelector('footer');
if (footer) {
  const name = document.createElement('b');
  name.textContent = 'Manjit Singh.';
  const role = document.createElement('span');
  role.textContent = 'Thoughtfully engineered. Built for people.';
  const copyright = document.createElement('span');
  copyright.textContent = `© ${new Date().getFullYear()} Manjit Singh`;
  footer.replaceChildren(name, role, copyright);
}

const demoRequest = document.querySelector('#demo-request');
if (demoRequest) {
  const openDemoRequest = () => {
    demoRequest.open = true;
    document.querySelector('#demo-name').focus({ preventScroll: true });
    demoRequest.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  document.querySelectorAll('[data-demo-open]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      openDemoRequest();
    });
  });
  if (location.hash === '#demo-request') openDemoRequest();
  window.addEventListener('hashchange', () => {
    if (location.hash === '#demo-request') openDemoRequest();
  });
  const demoForm = demoRequest.querySelector('form');
  const submitButton = demoForm.querySelector('[type="submit"]');
  const status = demoForm.querySelector('.demo-status');
  demoForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitButton.disabled) return;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending your request…';
    status.dataset.state = 'pending';
    status.textContent = 'Sending your demo request…';
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(demoForm)).toString()
      });
      if (!response.ok) throw new Error('Submission failed');
      demoForm.reset();
      status.dataset.state = 'success';
      status.textContent = 'Your demo request has been received. I’ll reply by email to discuss your idea and scope.';
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Your request could not be sent. Please try again or email mbmanjit5@gmail.com. Your details are still here.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Request My Free Demo';
    }
  });
}
