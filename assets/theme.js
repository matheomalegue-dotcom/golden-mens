// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      observer.unobserve(el.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Nav scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (!nav) return;
  if (window.scrollY > 40) {
    nav.style.borderColor = 'rgba(201, 160, 72, 0.30)';
    nav.style.background  = 'rgba(7, 9, 13, 0.96)';
  } else {
    nav.style.borderColor = 'rgba(201, 160, 72, 0.20)';
    nav.style.background  = 'rgba(7, 9, 13, 0.88)';
  }
});

// Service details toggle
function toggleDetails(btn) {
  const panel = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  btn.classList.toggle('open', !isOpen);
  panel.classList.toggle('open', !isOpen);
  btn.childNodes[0].textContent = isOpen ? ' Show Details' : ' Hide Details';
}
