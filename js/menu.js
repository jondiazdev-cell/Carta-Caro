const DEFAULT_PRODUCTS = [{"id": 1, "name": "Sopaipillas", "price": 500, "image": ""}, {"id": 2, "name": "Calzones rotos", "price": 1000, "image": ""}, {"id": 3, "name": "Cafe", "price": 500, "image": ""}, {"id": 4, "name": "Milo", "price": 1000, "image": ""}, {"id": 5, "name": "Capuchino", "price": 1000, "image": ""}, {"id": 6, "name": "Bebidas lata", "price": 1000, "image": ""}, {"id": 7, "name": "Score", "price": 1500, "image": ""}, {"id": 8, "name": "Completo italiano", "price": 2000, "image": ""}, {"id": 9, "name": "Completo dinámico", "price": 2500, "image": ""}, {"id": 10, "name": "Papas fritas chicas", "price": 2000, "image": ""}, {"id": 11, "name": "Papas fritas grandes", "price": 4000, "image": ""}, {"id": 12, "name": "Sachipapa chica", "price": 3000, "image": ""}, {"id": 13, "name": "Salchipapa grande", "price": 5000, "image": ""}, {"id": 14, "name": "Papa mechada chica", "price": 4500, "image": ""}, {"id": 15, "name": "Papa mechada grande", "price": 8000, "image": ""}, {"id": 16, "name": "Sandwich mechada", "price": 5000, "image": ""}, {"id": 17, "name": "Churrasco", "price": 5500, "image": ""}, {"id": 18, "name": "Barros luco", "price": 5500, "image": ""}, {"id": 19, "name": "Empanada horno pino", "price": 2000, "image": ""}, {"id": 20, "name": "Empanada horno napolitana", "price": 2000, "image": ""}, {"id": 21, "name": "Empanada horno pollo maíz", "price": 2000, "image": ""}, {"id": 22, "name": "Empanada frita pino", "price": 1000, "image": ""}, {"id": 23, "name": "Empanada frita queso", "price": 1000, "image": ""}, {"id": 24, "name": "Empanada frita mechada queso", "price": 1000, "image": ""}, {"id": 25, "name": "Empanada frita pollo maíz", "price": 1000, "image": ""}, {"id": 26, "name": "Trozo de pizza", "price": 2000, "image": ""}, {"id": 27, "name": "Pizza familiar 3 ingredientes", "price": 10000, "image": ""}];

const PRODUCTS_KEY = 'pollosKingProducts';
const SETTINGS_KEY = 'pollosKingSettings';

function getProducts() {
  try {
    const data = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    return Array.isArray(data) ? data : DEFAULT_PRODUCTS;
  } catch { return DEFAULT_PRODUCTS; }
}
function getSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; }
  catch { return {}; }
}
function formatPrice(price, name = '') {
  const suffix = name.toLowerCase().includes('empanada frita') ? ' c/u' : '';
  return '$' + Number(price).toLocaleString('es-CL') + suffix;
}
function renderMenu() {
  const settings = getSettings();
  const title = settings.title || 'Pollos King';
  document.getElementById('menuTitle').textContent = title;
  document.getElementById('footerTitle').textContent = title;
  if (settings.background) {
    document.querySelector('.hero').style.backgroundImage =
      `linear-gradient(135deg, rgba(25,25,25,.80), rgba(112,8,12,.60)), url("${settings.background}")`;
  }

  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  getProducts().forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const visual = product.image
      ? `<img class="product-image" src="${product.image}" alt="">`
      : `<div class="product-placeholder">🍗</div>`;
    card.innerHTML = `
      ${visual}
      <div class="product-name">${escapeHtml(product.name)}</div>
      <div class="product-price">${formatPrice(product.price, product.name)}</div>
    `;
    grid.appendChild(card);
  });
}
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  }[c]));
}
renderMenu();
