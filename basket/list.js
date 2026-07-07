function renderBasket() {
  const listEl = document.getElementById("basket-list");
  const emptyEl = document.getElementById("empty-state");
  const checkoutEl = document.getElementById("checkout-section");
  const totalCountEl = document.getElementById("total-count");
  const totalPriceEl = document.getElementById("total-price");

  const cart = getCart();

  if (cart.length === 0) {
    listEl.style.display = "none";
    checkoutEl.style.display = "none";
    emptyEl.style.display = "flex";
    return;
  }

  listEl.style.display = "flex";
  listEl.style.flexDirection = "column";
  listEl.style.gap = "var(--spacing-md)";
  checkoutEl.style.display = "flex";
  emptyEl.style.display = "none";

  listEl.innerHTML = cart
    .map((item) => {
      // Find full menu details to get the image
      const menu = getMenuById(item.menuId);
      const defaultImage = "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60";
      const imageSrc = menu ? menu.image : defaultImage;

      const optionBadge = item.temperature
        ? `<span class="item-option ${item.temperature.toLowerCase()}">${item.temperature}</span>`
        : "";

      const subtotal = item.price * item.quantity;

      return `
        <article class="basket-item glass" data-menu-id="${item.menuId}" data-temperature="${item.temperature || ""}">
          <div class="item-image-container">
            <img src="${imageSrc}" alt="${item.name}" onerror="this.src='${defaultImage}'">
          </div>
          <div class="item-details">
            <p class="item-name">${item.name}</p>
            ${optionBadge}
            <div class="item-meta">
              <div class="quantity-control">
                <button class="btn-decrease" aria-label="수량 감소">-</button>
                <span class="count">${item.quantity}</span>
                <button class="btn-increase" aria-label="수량 증가">+</button>
              </div>
              <div class="price-container">
                <span class="unit-price">개당 ${formatPrice(item.price)}</span>
                <span class="subtotal-price">${formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>
          <button class="btn-remove" aria-label="품목 삭제">✕</button>
        </article>
      `;
    })
    .join("");

  // Update summary info
  totalCountEl.textContent = `${getCartCount()}개`;
  totalPriceEl.textContent = formatPrice(getCartTotal());

  bindBasketEvents();
}

function bindBasketEvents() {
  const listEl = document.getElementById("basket-list");

  listEl.querySelectorAll(".basket-item").forEach((itemEl) => {
    const menuId = Number(itemEl.dataset.menuId);
    const temperature = itemEl.dataset.temperature || null;

    // Decrease
    itemEl.querySelector(".btn-decrease").addEventListener("click", () => {
      const cart = getCart();
      const current = cart.find(
        (item) => item.menuId === menuId && item.temperature === temperature
      );
      if (current && current.quantity > 1) {
        updateCartQuantity(menuId, temperature, current.quantity - 1);
        renderBasket();
      }
    });

    // Increase
    itemEl.querySelector(".btn-increase").addEventListener("click", () => {
      const cart = getCart();
      const current = cart.find(
        (item) => item.menuId === menuId && item.temperature === temperature
      );
      if (current) {
        if (current.quantity >= 10) {
          alert("한 메뉴당 최대 10잔까지만 주문 가능합니다.");
          return;
        }
        updateCartQuantity(menuId, temperature, current.quantity + 1);
        renderBasket();
      }
    });

    // Remove
    itemEl.querySelector(".btn-remove").addEventListener("click", () => {
      removeFromCart(menuId, temperature);
      renderBasket();
    });
  });
}

function init() {
  renderBasket();

  // Order click
  const btnOrder = document.getElementById("btn-order");
  const modal = document.getElementById("order-success-modal");
  const btnModalClose = document.getElementById("btn-modal-close");

  if (btnOrder) {
    btnOrder.addEventListener("click", () => {
      const newOrder = checkoutCart();
      if (newOrder) {
        // Show success modal
        modal.style.display = "flex";
      }
    });
  }

  if (btnModalClose) {
    btnModalClose.addEventListener("click", () => {
      modal.style.display = "none";
      window.location.href = "../orders/list.html";
    });
  }
}

init();
