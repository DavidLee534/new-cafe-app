function renderCategories() {
  const gridEl = document.getElementById("category-grid");

  gridEl.innerHTML = CATEGORIES.map(
    (category) => `
      <a href="menus/list.html?category=${category.id}" class="category-card glass">
        ${category.name}
      </a>
    `
  ).join("");
}

function renderPopularMenus() {
  const gridEl = document.getElementById("popular-grid");
  const popularMenus = getMenusByCategory("all").filter((menu) => menu.isPopular);

  if (popularMenus.length === 0) {
    gridEl.innerHTML = `<p class="empty-state">인기 메뉴를 준비 중입니다.</p>`;
    return;
  }

  gridEl.innerHTML = popularMenus
    .map((menu) => {
      const category = getCategoryById(menu.categoryId);
      const badgesHtml = `
        <span class="badge badge-popular">인기</span>
        ${menu.isNew ? `<span class="badge badge-new">신규</span>` : ""}
      `;

      return `
        <article class="menu-card glass" data-menu-id="${menu.id}">
          <div class="menu-image-container">
            <img
              src="${menu.image}"
              alt="${menu.name}"
              loading="lazy"
              onerror="this.src='https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60'"
            >
            <div class="menu-badges">${badgesHtml}</div>
            <span class="menu-category-tag">${category ? category.name : ""}</span>
          </div>
          <div class="menu-info">
            <p class="name">${menu.name}</p>
            <p class="desc">${menu.description}</p>
            <div class="menu-meta">
              <span class="price">${formatPrice(menu.price)}</span>
              ${menu.hasTemperatureOption ? `<span class="option-tag">ICE/HOT</span>` : ""}
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  gridEl.querySelectorAll(".menu-card").forEach((card) => {
    card.addEventListener("click", () => {
      window.location.href = `menus/detail.html?id=${card.dataset.menuId}`;
    });
  });
}

renderCategories();
renderPopularMenus();
