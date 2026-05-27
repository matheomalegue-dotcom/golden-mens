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

// Cart
function fmoney(cents) {
  return (cents / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
}

function updateCartCount(n) {
  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = n;
    el.classList.toggle('visible', n > 0);
  });
}

function renderCart(cart) {
  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  if (!body) return;

  if (cart.item_count === 0) {
    body.innerHTML = `<div class="cart-empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
      Your cart is empty
    </div>`;
    foot.innerHTML = '';
    return;
  }

  body.innerHTML = cart.items.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.product_title}</div>
        ${item.variant_title && item.variant_title !== 'Default Title' ? `<div class="cart-item-variant">${item.variant_title}</div>` : ''}
        <div class="cart-item-price">${fmoney(item.price)}</div>
        <div class="cart-item-qty">
          <button onclick="changeQty('${item.key}', ${item.quantity - 1})">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty('${item.key}', ${item.quantity + 1})">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="changeQty('${item.key}', 0)" aria-label="Remove">×</button>
    </div>
  `).join('');

  foot.innerHTML = `
    <div class="cart-subtotal">
      <span class="cart-subtotal-label">Subtotal</span>
      <span class="cart-subtotal-price">${fmoney(cart.total_price)}</span>
    </div>
    <a href="/checkout" class="cart-checkout-btn">Checkout →</a>
    <a href="/cart" class="cart-view-btn">View Full Cart</a>
  `;
}

function changeQty(key, qty) {
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: key, quantity: qty })
  })
  .then(r => r.json())
  .then(cart => { updateCartCount(cart.item_count); renderCart(cart); });
}

function openCart() {
  fetch('/cart.js').then(r => r.json()).then(cart => {
    updateCartCount(cart.item_count);
    renderCart(cart);
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}

function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Init cart count on load
fetch('/cart.js').then(r => r.json()).then(cart => updateCartCount(cart.item_count));

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
  .then(() => fetch('/cart.js').then(r => r.json()))
  .then(cart => {
    updateCartCount(cart.item_count);
    btn.classList.remove('loading');
    btn.classList.add('success');
    btn.textContent = '✓ Added';
    openCart();
    setTimeout(() => { btn.classList.remove('success'); btn.textContent = 'Add to Cart'; }, 2500);
  })
  .catch(() => { btn.classList.remove('loading'); btn.textContent = 'Add to Cart'; });
});

// Close cart on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

// Service details toggle
function toggleDetails(btn) {
  const panel = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  btn.classList.toggle('open', !isOpen);
  panel.classList.toggle('open', !isOpen);
  btn.childNodes[0].textContent = isOpen ? ' Show Details' : ' Hide Details';
}
