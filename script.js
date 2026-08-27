const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const cartButton = document.getElementById('cartButton');
const closeCart = document.getElementById('closeCart');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');
const newsletterForm = document.getElementById('newsletterForm');

let cart = [];

if (localStorage.getItem('vanta-theme') === 'dark') {
  body.classList.add('dark');
  themeToggle.textContent = '☀';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  const dark = body.classList.contains('dark');
  themeToggle.textContent = dark ? '☀' : '☾';
  localStorage.setItem('vanta-theme', dark ? 'dark' : 'light');
});

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('mobile-open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function openCart() {
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function hideCart() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

cartButton.addEventListener('click', openCart);
closeCart.addEventListener('click', hideCart);
overlay.addEventListener('click', hideCart);

function renderCart() {
  cartCount.textContent = cart.length;
  cartTotal.textContent = `$${cart.reduce((sum, item) => sum + item.price, 0)}`;

  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-cart">Your bag is empty.</div>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <div>
        <strong>${item.name}</strong><br>
        <small>$${item.price}</small>
      </div>
      <button class="remove-item" data-index="${index}">Remove</button>
    </div>
  `).join('');

  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const removed = cart.splice(Number(button.dataset.index), 1)[0];
      renderCart();
      showToast(`${removed.name} removed`);
    });
  });
}

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const product = {
      name: button.dataset.name,
      price: Number(button.dataset.price)
    };

    cart.push(product);
    renderCart();
    showToast(`${product.name} added to bag`);

    const original = button.textContent;
    button.textContent = 'Added ✓';
    setTimeout(() => button.textContent = original, 1000);
  });
});

document.querySelectorAll('.wish').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
    button.textContent = button.classList.contains('active') ? '♥' : '♡';
  });
});

newsletterForm.addEventListener('submit', event => {
  event.preventDefault();
  showToast('Thanks — you are subscribed');
  newsletterForm.reset();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

renderCart();
