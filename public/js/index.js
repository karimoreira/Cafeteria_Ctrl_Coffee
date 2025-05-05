const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Mensagem enviada com sucesso!');
    this.reset();
  });
}

// contador do carrinho
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = cart.length;
  }
}
updateCartCount();


function showInfoModal(message) {
  const modal = document.getElementById('info-modal');
  const messageEl = document.getElementById('info-modal-message');

  if (!modal || !messageEl) return;

  messageEl.textContent = message;
  modal.classList.remove('hidden');

  setTimeout(() => {
    modal.classList.add('hidden');
  }, 2500);
}

//add do carrinho
const addToCartButtons = document.querySelectorAll('.add-to-cart');
if (addToCartButtons.length > 0) {
  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img') || '';

      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ name, price, img });
      localStorage.setItem('cart', JSON.stringify(cart));

      updateCartCount();

      const cartModal = document.getElementById('cart-modal');
      const cartModalMessage = document.getElementById('cart-modal-message');

      if (cartModal && cartModalMessage) {
        cartModalMessage.textContent = `${name} adicionado ao carrinho!`;
        cartModal.classList.remove('hidden');
        setTimeout(() => {
          cartModal.classList.add('hidden');
        }, 2000);
      }
    });
  });
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('total-price');
  const subtotalEl = document.getElementById('subtotal');

  if (!container) return;

  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Seu carrinho está vazio.</p>';
    if (totalEl) totalEl.textContent = 'R$ 0,00';
    if (subtotalEl) subtotalEl.textContent = 'R$ 0,00';
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

  if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2)}`;
  if (subtotalEl) subtotalEl.textContent = `R$ ${total.toFixed(2)}`;
}

function removerItem(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function limparCarrinho() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    showInfoModal('Não há itens no carrinho.');
    return;
  }
  localStorage.removeItem('cart');
  renderCart();
  updateCartCount();
}


// renderizar
if (document.getElementById('cart-items')) {
  renderCart();
}

// resumo do pedido
if (document.getElementById('checkout-items')) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemsEl = document.getElementById('checkout-items');
  const totalEl = document.getElementById('checkout-total');
  let total = 0;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p>Seu carrinho está vazio.</p>';
  } else {
    cart.forEach(item => {
      total += item.price;
      const p = document.createElement('p');
      p.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;
      itemsEl.appendChild(p);
    });
  }

  totalEl.textContent = `R$ ${total.toFixed(2)}`;
}

// submissão pedido
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const endereco = document.getElementById('endereco').value;
    const pagamento = document.getElementById('pagamento').value;
    const carrinho = JSON.parse(localStorage.getItem('cart')) || [];

    if (carrinho.length === 0) {
      showInfoModal('Seu carrinho está vazio!');
      return;
    }

    const modal = document.getElementById('loading-modal');
    const modalMessage = document.getElementById('modal-message');
    modal.classList.remove('hidden');
    modalMessage.textContent = 'Enviando seu pedido...';

    try {
      const response = await fetch('/finalizar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, endereco, pagamento, carrinho })
      });

      const data = await response.json();
      modalMessage.textContent = data.message || 'Pedido enviado com sucesso!';
      setTimeout(() => {
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
      }, 3000);
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      modalMessage.textContent = 'Erro ao enviar o pedido. Tente novamente.';
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 3000);
    }
  });
}

// modal Finalizar Compra quando não houver itens no carrinho 
const finalizarBtn = document.getElementById('btn-finalizar');
if (finalizarBtn) {
  finalizarBtn.addEventListener('click', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      showInfoModal('Não há itens no carrinho.');
      return;
    }
    window.location.href = 'finalizar.html';
  });
}

// modal Esvaziar Carrinho quando não houver itens no carrinho 
const limparBtn = document.getElementById('btn-limpar');
if (limparBtn) {
  limparBtn.addEventListener('click', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      showInfoModal('Não há itens no carrinho.');
      return;
    }
    localStorage.removeItem('cart');
    renderCart();
    updateCartCount();
  });
}


