const categories = ['Zapatos', 'Ropa', 'Cosméticos', 'Juguetes', 'Electrodomésticos', 'Audífonos y electrónicos', 'Accesorios', 'Hogar', 'Otros'];

const products = [
  { id: 1, name: 'Zapatilla urbana', category: 'Zapatos', price: 120000, status: 'En tránsito', description: 'Diseño ligero y cómodo para uso diario.', image: '👟' },
  { id: 2, name: 'Chaqueta ligera', category: 'Ropa', price: 98000, status: 'Pendiente', description: 'Ideal para clima templado y estilo moderno.', image: '🧥' },
  { id: 3, name: 'Set skincare', category: 'Cosméticos', price: 76000, status: 'Confirmado', description: 'Rutina de cuidado con formulación suave.', image: '🧴' },
  { id: 4, name: 'Robot educativo', category: 'Juguetes', price: 160000, status: 'Entregado', description: 'Juego interactivo para aprender jugando.', image: '🤖' },
  { id: 5, name: 'Licuadora premium', category: 'Electrodomésticos', price: 240000, status: 'Pendiente', description: 'Potente y fácil de limpiar para cocina diaria.', image: '🥤' },
  { id: 6, name: 'Audífonos Bluetooth', category: 'Audífonos y electrónicos', price: 190000, status: 'En tránsito', description: 'Sonido envolvente con batería de larga duración.', image: '🎧' },
  { id: 7, name: 'Cartera minimal', category: 'Accesorios', price: 89000, status: 'Confirmado', description: 'Estilo elegante y espacio práctico.', image: '👜' },
  { id: 8, name: 'Set de cocina', category: 'Hogar', price: 135000, status: 'Entregado', description: 'Accesorios funcionales para la mesa y cocina.', image: '🍽️' },
  { id: 9, name: 'Kit de oficina', category: 'Otros', price: 95000, status: 'En tránsito', description: 'Suministros premium para equipos de trabajo.', image: '📚' },
];

const sampleOrders = [
  {
    customer: 'Daniel Córdoba',
    total: 3,
    status: 'Pendiente de compra',
    price: '',
    comments: 'Link de WhatsApp con fotos para confirmar.',
    items: [
      { name: 'Audífonos Bluetooth', category: 'Audífonos y electrónicos', size: 'M', color: 'Negro', brand: 'Sony', quantity: 1 },
      { name: 'Chaqueta ligera', category: 'Ropa', size: 'L', color: 'Azul', brand: 'North Face', quantity: 1 },
      { name: 'Set skincare', category: 'Cosméticos', size: 'Único', color: 'Blanco', brand: 'L’Oréal', quantity: 1 }
    ]
  },
  {
    customer: 'María Torres',
    total: 2,
    status: 'Comprado',
    price: 320000,
    comments: 'Confirmado por USA, entrega en Costa Rica.',
    items: [
      { name: 'Zapatilla urbana', category: 'Zapatos', size: '40', color: 'Blanco', brand: 'Nike', quantity: 1 },
      { name: 'Robot educativo', category: 'Juguetes', size: 'Único', color: 'Azul', brand: 'LEGO', quantity: 1 }
    ]
  }
];

const storedProducts = JSON.parse(localStorage.getItem('bl-products') || 'null');
const storedOrders = JSON.parse(localStorage.getItem('bl-orders') || 'null');

const state = {
  selected: [],
  products: Array.isArray(storedProducts) && storedProducts.length >= products.length ? storedProducts : products,
  orders: Array.isArray(storedOrders) && storedOrders.length ? storedOrders : sampleOrders,
};

if (!Array.isArray(storedProducts) || storedProducts.length < products.length) {
  localStorage.setItem('bl-products', JSON.stringify(products));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
}

function statusClass(status) {
  if (status === 'Entregado') return 'status-entregado';
  if (status === 'Comprado') return 'status-comprado';
  return 'status-pendiente';
}

function nextOrderStatus(status) {
  const states = ['Pendiente de compra', 'Comprado', 'Entregado'];
  const currentIndex = states.indexOf(status);
  return states[Math.min(currentIndex + 1, states.length - 1)];
}

function productImage(product) {
  const label = `${product.image} ${product.category}`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#2563eb"/><stop offset="1" stop-color="#93c5fd"/></linearGradient></defs><rect width="320" height="180" rx="24" fill="url(#g)"/><text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="42">${product.image}</text><text x="50%" y="74%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="#eff6ff">${label}</text></svg>`)}`;
}

function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  const grouped = categories.map((category) => ({
    category,
    items: state.products.filter((product) => product.category === category),
  }));

  grid.innerHTML = grouped
    .map((group) => `
      <section class="category-block">
        <div class="category-heading">
          <h3>${group.category}</h3>
          <span>${group.items.length} productos</span>
        </div>
        <div class="card-grid inner-grid">
          ${group.items.map((product) => `
            <article class="product-card">
              <img class="product-thumb" src="${productImage(product)}" alt="${product.name}" />
              <h4>${product.name}</h4>
              <p class="product-category-pill">${product.category}</p>
              <p class="hidden-price">Precio se confirmará en USA</p>
              <button class="primary-btn" data-add="${product.id}" type="button">Agregar al pedido</button>
            </article>
          `).join('')}
        </div>
      </section>
    `)
    .join('');
}

function renderCustomerForm() {
  const select = document.getElementById('product-select');
  if (!select) return;

  select.innerHTML = state.products
    .map((product) => `<option value="${product.id}" ${product.id === state.products[0]?.id ? 'selected' : ''}>${product.name} · ${product.category}</option>`)
    .join('');
}

function renderSelected() {
  const list = document.getElementById('selected-list');
  const count = document.getElementById('item-count');
  if (!list || !count) return;

  const selected = state.selected.length ? state.selected : [];
  list.innerHTML = selected.length
    ? selected
        .map((item) => `
          <article class="selected-item">
            <div>
              <strong>${item.name}</strong>
              <small>${item.category}</small>
            </div>
            <button class="small-btn" data-remove="${item.id}" type="button">Quitar</button>
          </article>
        `)
        .join('')
    : '<p class="small-note">Aún no has seleccionado productos.</p>';

  count.textContent = String(selected.length);
}

function renderAdmin() {
  const list = document.getElementById('admin-list');
  const ordersGrid = document.getElementById('orders-grid');
  const statusGrid = document.getElementById('status-grid');
  const confirmedDeliveries = document.getElementById('confirmed-deliveries');
  const lastUpdate = document.getElementById('last-update');

  if (list) {
    list.innerHTML = state.products
    .map((product) => `
      <article class="admin-row">
        <div>
          <h3>${product.name}</h3>
          <p>${product.category} · ${product.description}</p>
          <p>Estado: <strong>${product.status}</strong></p>
        </div>
        <label>
          <span class="small-note">Precio</span>
          <input class="price-input" data-price-input="${product.id}" type="number" min="0" step="1" value="${product.price}" />
        </label>
        <div>
          <button class="small-btn" data-save-price="${product.id}" type="button">Guardar precio</button>
          <button class="primary-btn" data-confirm="${product.id}" type="button" style="margin-top: 8px;">Confirmar entrega</button>
        </div>
      </article>
    `)
    .join('');
  }

  if (ordersGrid) {
    ordersGrid.innerHTML = state.orders
      .map((order, index) => `
        <article class="order-card">
          <div class="order-head">
            <div>
              <p class="eyebrow">Cliente</p>
              <h3>${order.customer}</h3>
            </div>
            <span class="status-pill ${statusClass(order.status)}">${order.status}</span>
          </div>
          <p class="small-note">Total del pedido: ${order.total} artículos</p>
          <ul class="order-items">
            ${order.items.map((item) => `<li><strong>${item.name}</strong> · ${item.category} · Talla ${item.size} · Color ${item.color || '—'} · Marca ${item.brand || '—'} · Cantidad ${item.quantity}</li>`).join('')}
          </ul>
          <details class="price-details">
            <summary>Agregar precio real (opcional)</summary>
            <label class="field-label">Precio real (COP)</label>
            <input class="price-input" data-order-price-input="${index}" type="number" min="0" step="1" value="${order.price || ''}" />
            <label class="field-label">Comentarios / WhatsApp / fotos</label>
            <textarea class="text-input text-area" data-order-comments-input="${index}" rows="3">${order.comments || ''}</textarea>
          </details>
          <label class="field-label">Estado</label>
          <select class="status-select" data-order-status-select="${index}">
            <option value="Pendiente de compra" ${order.status === 'Pendiente de compra' ? 'selected' : ''}>Pendiente de compra</option>
            <option value="Comprado" ${order.status === 'Comprado' ? 'selected' : ''}>Comprado</option>
            <option value="Entregado" ${order.status === 'Entregado' ? 'selected' : ''}>Entregado</option>
          </select>
          <button class="primary-btn" data-update-order-status="${index}" type="button">Actualizar estado</button>
          <p class="small-note">Al pulsarlo, la orden pasa automáticamente al siguiente estado.</p>
        </article>
      `)
      .join('');
  }

  if (statusGrid) {
    const statusStats = [
      { label: 'Pendiente de compra', value: state.orders.filter((o) => o.status === 'Pendiente de compra').length, className: 'status-pendiente' },
      { label: 'Comprado', value: state.orders.filter((o) => o.status === 'Comprado').length, className: 'status-comprado' },
      { label: 'Entregado', value: state.orders.filter((o) => o.status === 'Entregado').length, className: 'status-entregado' },
    ];
    statusGrid.innerHTML = statusStats.map((item) => `
      <article class="status-card ${item.className}">
        <strong>${item.value}</strong>
        <span>${item.label}</span>
      </article>
    `).join('');
  }

  if (confirmedDeliveries) confirmedDeliveries.textContent = String(state.orders.filter((order) => order.status === 'Entregado').length);
  if (lastUpdate) lastUpdate.textContent = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

function updateProductPrice(id, price) {
  state.products = state.products.map((product) => (product.id === id ? { ...product, price } : product));
  localStorage.setItem('bl-products', JSON.stringify(state.products));
}

function confirmDelivery(id) {
  state.products = state.products.map((product) => (product.id === id ? { ...product, status: 'Entregado' } : product));
  localStorage.setItem('bl-products', JSON.stringify(state.products));
}

function updateOrderStatus(index) {
  const currentStatus = state.orders[index]?.status || 'Pendiente de compra';
  const nextStatus = nextOrderStatus(currentStatus);
  const price = Number(document.querySelector(`[data-order-price-input="${index}"]`)?.value || 0);
  const comments = document.querySelector(`[data-order-comments-input="${index}"]`)?.value || '';

  state.orders = state.orders.map((order, orderIndex) =>
    orderIndex === index
      ? {
          ...order,
          status: nextStatus,
          price: Number.isFinite(price) ? price : order.price,
          comments,
        }
      : order
  );
  localStorage.setItem('bl-orders', JSON.stringify(state.orders));
}

function addToSelection(id) {
  const product = state.products.find((item) => item.id === id);
  if (!product) return;
  if (!state.selected.some((item) => item.id === id)) {
    state.selected.push({ id: product.id, name: product.name, category: product.category });
  }
  renderSelected();
}

function removeFromSelection(id) {
  state.selected = state.selected.filter((item) => item.id !== id);
  renderSelected();
}

function attachCatalogEvents() {
  document.addEventListener('click', (event) => {
    const addBtn = event.target.closest('[data-add]');
    if (addBtn) addToSelection(Number(addBtn.dataset.add));

    const removeBtn = event.target.closest('[data-remove]');
    if (removeBtn) removeFromSelection(Number(removeBtn.dataset.remove));

    const confirmBtn = document.getElementById('confirm-order');
    if (event.target === confirmBtn) {
      const productSelect = document.getElementById('product-select');
      if (productSelect) {
        const productId = Number(productSelect.value || 0);
        const product = state.products.find((item) => item.id === productId);
        const size = document.getElementById('size-input')?.value?.trim() || 'Único';
        const color = document.getElementById('color-input')?.value?.trim() || 'Sin color';
        const brand = document.getElementById('brand-input')?.value?.trim() || 'Sin marca';
        const quantity = Number(document.getElementById('quantity-input')?.value || 1);
        const customerName = document.getElementById('customer-name')?.value?.trim();
        const details = document.getElementById('order-details')?.value?.trim() || '';

        if (!product) {
          alert('Selecciona un producto para registrar la pre-orden.');
          return;
        }

        if (!customerName) {
          alert('Necesitamos un nombre para registrar tu pedido.');
          return;
        }

        if (!Number.isFinite(quantity) || quantity < 1) {
          alert('La cantidad debe ser al menos 1.');
          return;
        }

        state.orders.unshift({
          customer: customerName,
          total: quantity,
          status: 'Pendiente de compra',
          price: '',
          comments: `${details}\nTalla: ${size}\nColor: ${color}\nMarca: ${brand}`.trim(),
          items: [{ name: product.name, category: product.category, size, quantity }],
          notes: `${details} | Talla: ${size} | Color: ${color} | Marca: ${brand}`.trim(),
        });
        localStorage.setItem('bl-orders', JSON.stringify(state.orders));
        renderAdmin();
        alert(`Pre-orden registrada para ${customerName}. Estado inicial: Pendiente de compra.`);
        return;
      }

      if (!state.selected.length) {
        alert('Selecciona al menos un producto para confirmar.');
        return;
      }

      const customerName = document.getElementById('customer-name')?.value?.trim();
      if (!customerName) {
        alert('Necesitamos un nombre para registrar tu pedido.');
        return;
      }

      const details = document.getElementById('order-details')?.value?.trim() || '';
      state.orders.unshift({
        customer: customerName,
        total: state.selected.length,
        status: 'Pendiente de compra',
        price: '',
        comments: details,
        items: state.selected.map((item) => ({
          name: item.name,
          category: item.category,
          size: details ? 'Personalizado' : 'Único',
          quantity: 1,
        })),
        notes: details,
      });
      localStorage.setItem('bl-orders', JSON.stringify(state.orders));
      state.selected = [];
      renderSelected();
      renderAdmin();
      alert(`Pre-orden registrada para ${customerName}. Estado inicial: Pendiente de compra.`);
    }
  });
}

function attachAdminEvents() {
  document.addEventListener('click', (event) => {
    const saveBtn = event.target.closest('[data-save-price]');
    if (saveBtn) {
      const id = Number(saveBtn.dataset.savePrice);
      const input = document.querySelector(`[data-price-input="${id}"]`);
      const price = Number(input?.value || 0);
      updateProductPrice(id, price);
      renderAdmin();
      alert('Precio actualizado correctamente.');
    }

    const confirmBtn = event.target.closest('[data-confirm]');
    if (confirmBtn) {
      const id = Number(confirmBtn.dataset.confirm);
      confirmDelivery(id);
      renderAdmin();
      alert('Entrega confirmada.');
    }

    const updateStatusBtn = event.target.closest('[data-update-order-status]');
    if (updateStatusBtn) {
      const index = Number(updateStatusBtn.dataset.updateOrderStatus);
      updateOrderStatus(index);
      renderAdmin();
      alert('Estado de la orden actualizado.');
    }
  });
}

function init() {
  if (document.getElementById('catalog-grid')) {
    renderCatalog();
    renderCustomerForm();
    renderSelected();
    attachCatalogEvents();
  }

  if (document.getElementById('orders-grid') || document.getElementById('status-grid')) {
    renderAdmin();
    attachAdminEvents();
  }
}

init();
