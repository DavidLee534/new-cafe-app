/* ==========================================================================
   공통 유틸리티 (장바구니, 포맷 등)
   ========================================================================== */

const CART_STORAGE_KEY = "cafe-app-cart";

/* ---------------- 포맷 ---------------- */

function formatPrice(price) {
  return `${price.toLocaleString("ko-KR")}원`;
}

function formatDate(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

/* ---------------- 장바구니 ---------------- */

function getCart() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(
    (cartItem) =>
      cartItem.menuId === item.menuId &&
      cartItem.temperature === item.temperature
  );

  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    cart.push({
      menuId: item.menuId,
      name: item.name,
      price: item.price,
      temperature: item.temperature || null,
      quantity: item.quantity || 1,
    });
  }

  saveCart(cart);
  return cart;
}

function removeFromCart(menuId, temperature) {
  const cart = getCart().filter(
    (item) => !(item.menuId === menuId && item.temperature === temperature)
  );
  saveCart(cart);
  return cart;
}

function updateCartQuantity(menuId, temperature, quantity) {
  const cart = getCart();
  const target = cart.find(
    (item) => item.menuId === menuId && item.temperature === temperature
  );

  if (target) {
    target.quantity = Math.max(1, quantity);
    saveCart(cart);
  }

  return cart;
}

function clearCart() {
  saveCart([]);
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return getCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}
