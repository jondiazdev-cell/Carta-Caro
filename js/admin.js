const DEFAULT_PRODUCTS = [{"id": 1, "name": "Sopaipillas", "price": 500, "image": ""}, {"id": 2, "name": "Calzones rotos", "price": 1000, "image": ""}, {"id": 3, "name": "Cafe", "price": 500, "image": ""}, {"id": 4, "name": "Milo", "price": 1000, "image": ""}, {"id": 5, "name": "Capuchino", "price": 1000, "image": ""}, {"id": 6, "name": "Bebidas lata", "price": 1000, "image": ""}, {"id": 7, "name": "Score", "price": 1500, "image": ""}, {"id": 8, "name": "Completo italiano", "price": 2000, "image": ""}, {"id": 9, "name": "Completo dinámico", "price": 2500, "image": ""}, {"id": 10, "name": "Papas fritas chicas", "price": 2000, "image": ""}, {"id": 11, "name": "Papas fritas grandes", "price": 4000, "image": ""}, {"id": 12, "name": "Sachipapa chica", "price": 3000, "image": ""}, {"id": 13, "name": "Salchipapa grande", "price": 5000, "image": ""}, {"id": 14, "name": "Papa mechada chica", "price": 4500, "image": ""}, {"id": 15, "name": "Papa mechada grande", "price": 8000, "image": ""}, {"id": 16, "name": "Sandwich mechada", "price": 5000, "image": ""}, {"id": 17, "name": "Churrasco", "price": 5500, "image": ""}, {"id": 18, "name": "Barros luco", "price": 5500, "image": ""}, {"id": 19, "name": "Empanada horno pino", "price": 2000, "image": ""}, {"id": 20, "name": "Empanada horno napolitana", "price": 2000, "image": ""}, {"id": 21, "name": "Empanada horno pollo maíz", "price": 2000, "image": ""}, {"id": 22, "name": "Empanada frita pino", "price": 1000, "image": ""}, {"id": 23, "name": "Empanada frita queso", "price": 1000, "image": ""}, {"id": 24, "name": "Empanada frita mechada queso", "price": 1000, "image": ""}, {"id": 25, "name": "Empanada frita pollo maíz", "price": 1000, "image": ""}, {"id": 26, "name": "Trozo de pizza", "price": 2000, "image": ""}, {"id": 27, "name": "Pizza familiar 3 ingredientes", "price": 10000, "image": ""}];

const PRODUCTS_KEY = 'pollosKingProducts';
const SETTINGS_KEY = 'pollosKingSettings';

const $ = id => document.getElementById(id);
let products = getProducts();
let settings = getSettings();

function getProducts() {
  try {
    const data = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    return Array.isArray(data) ? data : structuredClone(DEFAULT_PRODUCTS);
  } catch { return structuredClone(DEFAULT_PRODUCTS); }
}
function getSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; }
  catch { return {}; }
}
function saveProducts() {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  renderTable();
}
function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
function money(value) {
  return '$' + Number(value).toLocaleString('es-CL');
}
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  }[c]));
}
function showAlert(message, type='success') {
  $('alertBox').innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
    ${escapeHtml(message)}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>`;
  setTimeout(() => { $('alertBox').innerHTML = ''; }, 3500);
}
function renderTable() {
  $('productCount').textContent = `${products.length} productos`;
  const body = $('productTableBody');
  if (!products.length) {
    body.innerHTML = '<tr><td colspan="4" class="empty-state">No hay productos.</td></tr>';
    return;
  }
  body.innerHTML = products.map(p => `
    <tr>
      <td class="fw-semibold">${escapeHtml(p.name)}</td>
      <td>${money(p.price)}</td>
      <td>${p.image ? `<img class="product-thumb" src="${p.image}" alt="">` : '<span class="text-secondary">Sin imagen</span>'}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct(${p.id})">Editar</button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${p.id})">Eliminar</button>
      </td>
    </tr>
  `).join('');
}
function resetForm() {
  $('productForm').reset();
  $('productId').value = '';
  $('formHeading').textContent = 'Añadir producto';
  $('saveProductBtn').textContent = 'Añadir producto';
  $('cancelEditBtn').classList.add('d-none');
  $('currentImageWrap').classList.add('d-none');
  $('currentImage').src = '';
}
window.editProduct = function(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  $('productId').value = p.id;
  $('productName').value = p.name;
  $('productPrice').value = p.price;
  $('formHeading').textContent = 'Editar producto';
  $('saveProductBtn').textContent = 'Guardar cambios';
  $('cancelEditBtn').classList.remove('d-none');
  if (p.image) {
    $('currentImageWrap').classList.remove('d-none');
    $('currentImage').src = p.image;
  } else $('currentImageWrap').classList.add('d-none');
  window.scrollTo({top: 0, behavior: 'smooth'});
};
window.deleteProduct = function(id) {
  const p = products.find(x => x.id === id);
  if (!p || !confirm(`¿Eliminar "${p.name}"?`)) return;
  products = products.filter(x => x.id !== id);
  saveProducts();
  showAlert('Producto eliminado.');
};
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

$('productForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = Number($('productId').value);
  const name = $('productName').value.trim();
  const price = Number($('productPrice').value);
  const file = $('productImage').files[0];
  if (!name || price < 0) return;
  const image = file ? await fileToDataUrl(file) : '';
  if (id) {
    const p = products.find(x => x.id === id);
    if (p) {
      p.name = name;
      p.price = price;
      if (file) p.image = image;
    }
    showAlert('Producto actualizado.');
  } else {
    products.push({id: Date.now(), name, price, image});
    showAlert('Producto añadido.');
  }
  saveProducts();
  resetForm();
});
$('cancelEditBtn').addEventListener('click', resetForm);
$('removeImageBtn').addEventListener('click', () => {
  const id = Number($('productId').value);
  const p = products.find(x => x.id === id);
  if (p) p.image = '';
  saveProducts();
  $('currentImageWrap').classList.add('d-none');
  showAlert('Imagen eliminada.');
});

$('settingsForm').addEventListener('submit', async e => {
  e.preventDefault();
  settings.title = $('menuTitleInput').value.trim() || 'Pollos King';
  const file = $('backgroundInput').files[0];
  if (file) settings.background = await fileToDataUrl(file);
  saveSettings();
  updateSettingsPreview();
  showAlert('Configuración guardada.');
});
$('resetSettingsBtn').addEventListener('click', () => {
  if (!confirm('¿Restablecer el fondo original?')) return;
  settings.background = '';
  saveSettings();
  $('backgroundInput').value = '';
  updateSettingsPreview();
  showAlert('Fondo restablecido.');
});
$('resetProductsBtn').addEventListener('click', () => {
  if (!confirm('Esto reemplazará todos los productos por el menú original. ¿Continuar?')) return;
  products = structuredClone(DEFAULT_PRODUCTS);
  saveProducts();
  resetForm();
  showAlert('Menú original restaurado.');
});
function updateSettingsPreview() {
  $('menuTitleInput').value = settings.title || 'Pollos King';
  if (settings.background) {
    $('backgroundPreviewWrap').classList.remove('d-none');
    $('backgroundPreview').src = settings.background;
  } else $('backgroundPreviewWrap').classList.add('d-none');
}
renderTable();
updateSettingsPreview();
