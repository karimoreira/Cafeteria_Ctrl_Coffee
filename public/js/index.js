// ======= Formulário de Contato =======
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Mensagem enviada com sucesso!');
    this.reset();
  });
}

// ======= Atualização do Contador do Carrinho =======
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = cart.length;
  }
}
updateCartCount();

// ======= Adicionar ao Carrinho =======
const addToCartButtons = document.querySelectorAll('.add-to-cart');
if (addToCartButtons.length > 0) {
  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img') || ''; // NOVO

      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ name, price, img }); // inclui imagem no objeto
      localStorage.setItem('cart', JSON.stringify(cart));

      updateCartCount();
      alert(`${name} adicionado ao carrinho!`);
    });
  });
}

// ======= Página do Carrinho (renderização e funções) =======
function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('total-price');
  const subtotalEl = document.getElementById('subtotal');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Seu carrinho está vazio.</p>';
    totalEl.textContent = 'R$ 0,00';
    subtotalEl.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img || 'https://via.placeholder.com/80'}" alt="${item.name}">
      <div class="info">
        <strong>${item.name}</strong>
      </div>
      <div class="right">
        <span>R$ ${item.price.toFixed(2)}</span>
        <button onclick="removerItem(${i})">Remover</button>
      </div>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = `R$ ${total.toFixed(2)}`;
  subtotalEl.textContent = `R$ ${total.toFixed(2)}`;
}


function removerItem(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function limparCarrinho() {
  localStorage.removeItem('cart');
  renderCart();
  updateCartCount();
}

if (document.getElementById('cart-items')) {
  renderCart();
}
