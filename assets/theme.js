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

// Add to cart
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.product-atc[data-variant-id]');
  if (!btn) return;
  const id = btn.dataset.variantId;
  btn.classList.add('loading');
  btn.textContent = 'Adding…';
  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id), quantity: 1 })
  })
  .then(r => r.json())
  .then(() => {
    btn.classList.remove('loading');
    btn.classList.add('success');
    btn.textContent = '✓ Added';
    setTimeout(() => {
      btn.classList.remove('success');
      btn.textContent = 'Add to Cart';
    }, 2500);
  })
  .catch(() => {
    btn.classList.remove('loading');
    btn.textContent = 'Add to Cart';
  });
});

// Service details toggle
function toggleDetails(btn) {
  const panel = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  btn.classList.toggle('open', !isOpen);
  panel.classList.toggle('open', !isOpen);
  btn.childNodes[0].textContent = isOpen ? ' Show Details' : ' Hide Details';
}
