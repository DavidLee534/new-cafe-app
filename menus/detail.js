const CATEGORY_ICONS = {
  coffee: "☕",
  "non-coffee": "🥤",
  tea: "🍵",
  dessert: "🍰",
};

function getMenuIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

let state = {
  menu: null,
  temperature: "ICE",
  quantity: 1,
};

function renderDetail() {
  const container = document.getElementById("menu-detail");
  const menu = state.menu;

  if (!menu) {
    container.innerHTML = `<p class="empty-state">메뉴를 찾을 수 없습니다.</p>`;
    return;
  }

  const totalPrice = menu.price * state.quantity;

  container.innerHTML = `
    <div class="detail-container">
      <div class="detail-thumb">${CATEGORY_ICONS[menu.categoryId] || "☕"}</div>
      <section class="detail-info glass">
        <p class="name">${menu.name}</p>
        <p class="price">${formatPrice(menu.price)}</p>
        <p class="description">${menu.description}</p>
      </section>

      ${
        menu.hasTemperatureOption
          ? `
        <div class="option-group">
          <p class="label">온도 선택</p>
          <div class="option-buttons">
            <button class="option-btn ${state.temperature === "ICE" ? "active" : ""}" data-temperature="ICE">ICE</button>
            <button class="option-btn ${state.temperature === "HOT" ? "active" : ""}" data-temperature="HOT">HOT</button>
          </div>
        </div>
      `
          : ""
      }

      <div class="option-group">
        <p class="label">수량</p>
        <div class="quantity-control">
          <button id="decrease-btn">-</button>
          <span class="count">${state.quantity}</span>
          <button id="increase-btn">+</button>
        </div>
      </div>
    </div>

    <div class="add-to-cart-bar glass">
      <span class="total-price">${formatPrice(totalPrice)}</span>
      <button class="add-to-cart-btn" id="add-to-cart-btn">장바구니 담기</button>
    </div>
  `;

  bindDetailEvents();
}

function bindDetailEvents() {
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.temperature = btn.dataset.temperature;
      renderDetail();
    });
  });

  const decreaseBtn = document.getElementById("decrease-btn");
  const increaseBtn = document.getElementById("increase-btn");

  if (decreaseBtn) {
    decreaseBtn.addEventListener("click", () => {
      state.quantity = Math.max(1, state.quantity - 1);
      renderDetail();
    });
  }

  if (increaseBtn) {
    increaseBtn.addEventListener("click", () => {
      state.quantity += 1;
      renderDetail();
    });
  }

  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      addToCart({
        menuId: state.menu.id,
        name: state.menu.name,
        price: state.menu.price,
        temperature: state.menu.hasTemperatureOption ? state.temperature : null,
        quantity: state.quantity,
      });
      window.location.href = "list.html";
    });
  }
}

function init() {
  const menuId = getMenuIdFromUrl();
  state.menu = getMenuById(menuId);
  renderDetail();
}

init();
