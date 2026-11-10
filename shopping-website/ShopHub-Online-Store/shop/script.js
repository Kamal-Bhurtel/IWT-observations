// ==================== CART MANAGEMENT ====================
function getCart() {
  return JSON.parse(localStorage.getItem('shophub_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('shophub_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

function addToCart(productId, quantity = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart!`);
  animateCartIcon();
}

function removeFromCart(productId) {
  let cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
  showToast('Item removed from cart');
}

function updateQuantity(productId, newQty) {
  if (newQty < 1) {
    removeFromCart(productId);
    return;
  }
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = newQty;
    saveCart(cart);
    renderCart();
  }
}

// ==================== TOAST ====================
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

function animateCartIcon() {
  document.querySelectorAll('.cart-link').forEach(el => {
    el.classList.add('cart-bounce');
    setTimeout(() => el.classList.remove('cart-bounce'), 600);
  });
}

// ==================== RENDER PRODUCTS (HOME) ====================
let currentCategory = 'all';
let currentSort = 'default';
let searchQuery = '';

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  let filtered = currentCategory === 'all'
    ? [...products]
    : products.filter(p => p.category === currentCategory);

  // Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Sort
  if (currentSort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  else if (currentSort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  else if (currentSort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (currentSort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-products">
        <i class="fas fa-search" style="font-size:2.5rem;color:#d1d5db;margin-bottom:12px;"></i>
        <p>No products found. Try a different search or category.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((p, i) => `
    <article class="product-card" style="animation-delay: ${i * 0.06}s">
      <a href="product.html?id=${p.id}" class="product-image-link">
        <div class="product-image">
          ${p.badge ? `<span class="badge ${p.badge.toLowerCase()}">${p.badge}</span>` : ''}
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <div class="quick-actions">
            <button class="quick-btn" onclick="event.preventDefault(); addToCart(${p.id})" title="Add to Cart">
              <i class="fas fa-cart-plus"></i>
            </button>
            <button class="quick-btn" onclick="event.preventDefault(); window.location='product.html?id=${p.id}'" title="View Details">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
      </a>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <a href="product.html?id=${p.id}" class="product-name">${p.name}</a>
        <div class="product-rating">
          ${renderStars(p.rating)}
          <span class="reviews">(${p.reviews})</span>
        </div>
        <div class="product-price">
          <span class="current">${formatINR(p.price)}</span>
          ${p.originalPrice ? `<span class="original">${formatINR(p.originalPrice)}</span><span class="off">${Math.round((1 - p.price / p.originalPrice) * 100)}% off</span>` : ''}
        </div>
        <button class="btn btn-add" onclick="addToCart(${p.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </article>
  `).join('');
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
  if (half) html += '<i class="fas fa-star-half-alt"></i>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) html += '<i class="far fa-star"></i>';
  return html;
}

function setupCategoryFilters() {
  document.querySelectorAll('.category-card').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-card').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderProducts();
    });
  });
}

function setupSort() {
  const select = document.getElementById('sort-select');
  if (select) {
    select.addEventListener('change', () => {
      currentSort = select.value;
      renderProducts();
    });
  }
}

function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  let timeout;
  input.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      searchQuery = input.value.trim();
      renderProducts();
    }, 250);
  });
}

// ==================== PRODUCT DETAIL ====================
function renderProductDetail(id) {
  const product = products.find(p => p.id === id);
  const container = document.getElementById('product-detail');
  if (!product || !container) {
    container.innerHTML = '<p class="error">Product not found. <a href="index.html">Back to shop</a></p>';
    return;
  }

  document.title = `${product.name} – ShopHub`;
  const breadcrumb = document.getElementById('breadcrumb-name');
  if (breadcrumb) breadcrumb.textContent = product.name;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  container.innerHTML = `
    <div class="detail-gallery">
      <div class="main-image">
        <img src="${product.images[0]}" alt="${product.name}" id="main-img">
        ${product.badge ? `<span class="badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
      </div>
      <div class="thumbnails">
        ${product.images.map((img, i) => `
          <button class="thumb ${i === 0 ? 'active' : ''}" onclick="changeImage('${img}', this)">
            <img src="${img}" alt="View ${i + 1}">
          </button>
        `).join('')}
      </div>
    </div>
    <div class="detail-info">
      <span class="product-category">${product.category}</span>
      <h1>${product.name}</h1>
      <div class="product-rating large">
        ${renderStars(product.rating)}
        <span class="reviews">${product.rating} (${product.reviews.toLocaleString('en-IN')} reviews)</span>
      </div>
      <div class="detail-price">
        <span class="current">${formatINR(product.price)}</span>
        ${product.originalPrice ? `
          <span class="original">${formatINR(product.originalPrice)}</span>
          <span class="discount">-${discount}%</span>
        ` : ''}
      </div>
      <p class="description">${product.description}</p>
      <ul class="features-list">
        ${product.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
      </ul>
      <div class="stock ${product.stock < 10 ? 'low' : ''}">
        ${product.stock > 0
          ? `<i class="fas fa-check-circle"></i> In Stock (${product.stock} available)`
          : '<i class="fas fa-times-circle"></i> Out of Stock'}
      </div>
      <div class="quantity-selector">
        <label>Quantity:</label>
        <div class="qty-controls">
          <button type="button" onclick="changeQty(-1)">−</button>
          <input type="number" id="qty-input" value="1" min="1" max="${product.stock}">
          <button type="button" onclick="changeQty(1)">+</button>
        </div>
      </div>
      <div class="detail-actions">
        <button class="btn btn-primary btn-lg" onclick="addToCartFromDetail(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
        <a href="cart.html" class="btn btn-outline btn-lg">
          <i class="fas fa-shopping-cart"></i> View Cart
        </a>
      </div>
      <div class="trust-badges">
        <span><i class="fas fa-shipping-fast"></i> Free shipping over ₹4,000</span>
        <span><i class="fas fa-undo"></i> 30-day returns</span>
        <span><i class="fas fa-shield-alt"></i> Secure payment</span>
      </div>
    </div>
  `;
}

function changeImage(src, btn) {
  const main = document.getElementById('main-img');
  if (main) {
    main.style.opacity = '0';
    setTimeout(() => {
      main.src = src;
      main.style.opacity = '1';
    }, 150);
  }
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

function changeQty(delta) {
  const input = document.getElementById('qty-input');
  if (!input) return;
  let val = parseInt(input.value) + delta;
  const max = parseInt(input.max);
  if (val < 1) val = 1;
  if (val > max) val = max;
  input.value = val;
}

function addToCartFromDetail(id) {
  const qty = parseInt(document.getElementById('qty-input')?.value || 1);
  addToCart(id, qty);
}

function renderRelated(currentId) {
  const product = products.find(p => p.id === currentId);
  if (!product) return;
  const related = products
    .filter(p => p.category === product.category && p.id !== currentId)
    .slice(0, 4);

  const grid = document.getElementById('related-grid');
  if (!grid) return;

  grid.innerHTML = related.map((p, i) => `
    <article class="product-card" style="animation-delay: ${i * 0.06}s">
      <a href="product.html?id=${p.id}" class="product-image-link">
        <div class="product-image">
          ${p.badge ? `<span class="badge ${p.badge.toLowerCase()}">${p.badge}</span>` : ''}
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
      </a>
      <div class="product-info">
        <a href="product.html?id=${p.id}" class="product-name">${p.name}</a>
        <div class="product-rating">${renderStars(p.rating)}</div>
        <div class="product-price">
          <span class="current">${formatINR(p.price)}</span>
        </div>
        <button class="btn btn-add" onclick="addToCart(${p.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </article>
  `).join('');
}

// ==================== CART PAGE ====================
function renderCart() {
  const cart = getCart();
  const emptyEl = document.getElementById('cart-empty');
  const contentEl = document.getElementById('cart-content');
  const itemsEl = document.getElementById('cart-items');

  if (!emptyEl || !contentEl || !itemsEl) return;

  if (cart.length === 0) {
    emptyEl.style.display = 'block';
    contentEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  contentEl.style.display = 'grid';

  let subtotal = 0;

  itemsEl.innerHTML = cart.map(item => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;
    return `
      <div class="cart-item">
        <a href="product.html?id=${item.id}" class="cart-item-img">
          <img src="${item.image}" alt="${item.name}">
        </a>
        <div class="cart-item-details">
          <a href="product.html?id=${item.id}" class="cart-item-name">${item.name}</a>
          <div class="cart-item-price">${formatINR(item.price)}</div>
        </div>
        <div class="cart-item-qty">
          <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-total">${formatINR(lineTotal)}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  }).join('');

  const shipping = subtotal >= 4000 ? 0 : 99;
  const total = subtotal + shipping;

  document.getElementById('subtotal').textContent = formatINR(subtotal);
  document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : formatINR(shipping);
  document.getElementById('total').textContent = formatINR(total);
}

// ==================== CHECKOUT ====================
function setupCheckout() {
  const checkoutBtn = document.getElementById('checkout-btn');
  const modal = document.getElementById('checkout-modal');
  const successModal = document.getElementById('success-modal');
  const closeBtn = document.getElementById('modal-close');
  const form = document.getElementById('checkout-form');

  if (!checkoutBtn) return;

  checkoutBtn.addEventListener('click', () => {
    modal.classList.add('open');
  });

  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    modal.classList.remove('open');

    const orderId = 'SH' + Date.now().toString().slice(-8);
    document.getElementById('order-id').textContent = orderId;

    localStorage.removeItem('shophub_cart');
    updateCartCount();

    successModal.classList.add('open');
    // Simple confetti effect via CSS particles if desired
  });
}

// ==================== MOBILE MENU ====================
function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.innerHTML = nav.classList.contains('open')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
  }
}

// ==================== SCROLL ANIMATIONS ====================
function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature, .product-card').forEach(el => {
    observer.observe(el);
  });
}
