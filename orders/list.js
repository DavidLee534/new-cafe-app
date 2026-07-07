function buildOrderSummary(order) {
  const firstItem = order.items[0];
  const restCount = order.items.length - 1;
  return restCount > 0
    ? `${firstItem.name} 외 ${restCount}건`
    : firstItem.name;
}

function renderOrderList() {
  const listEl = document.getElementById("order-list");
  const orders = getOrders();

  if (orders.length === 0) {
    listEl.innerHTML = `<p class="empty-state">주문 내역이 없습니다.</p>`;
    return;
  }

  listEl.innerHTML = orders
    .map(
      (order) => `
        <article class="order-card glass" data-order-id="${order.id}">
          <div class="order-top">
            <span class="order-date">${formatDate(order.orderDate)}</span>
            <span class="status-badge ${order.status === "주문취소" ? "cancelled" : ""}">${order.status}</span>
          </div>
          <p class="order-summary">${buildOrderSummary(order)}</p>
          <p class="order-total">${formatPrice(getOrderTotal(order))}</p>
        </article>
      `
    )
    .join("");
}

renderOrderList();
