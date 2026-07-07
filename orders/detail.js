function getOrderIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderOrderDetail() {
  const container = document.getElementById("order-detail");
  const orderId = getOrderIdFromUrl();
  const order = getOrderById(orderId);

  if (!order) {
    container.innerHTML = `<p class="empty-state">주문을 찾을 수 없습니다.</p>`;
    return;
  }

  const itemsHtml = order.items
    .map(
      (item) => `
        <div class="item-row glass">
          <div>
            <p class="item-name">${item.name}${item.temperature ? ` (${item.temperature})` : ""}</p>
            <p class="item-option">${item.quantity}개</p>
          </div>
          <span class="item-price">${formatPrice(item.price * item.quantity)}</span>
        </div>
      `
    )
    .join("");

  container.innerHTML = `
    <div class="detail-container">
      <section class="detail-summary glass">
        <div class="order-top">
          <span class="order-date">${formatDate(order.orderDate)}</span>
          <span class="status-badge ${order.status === "주문취소" ? "cancelled" : ""}">${order.status}</span>
        </div>
        <p>주문번호 #${order.id}</p>
      </section>

      <div class="item-list">${itemsHtml}</div>

      <div class="total-bar glass">
        <span class="label">총 결제금액</span>
        <span class="amount">${formatPrice(getOrderTotal(order))}</span>
      </div>
    </div>
  `;
}

renderOrderDetail();
