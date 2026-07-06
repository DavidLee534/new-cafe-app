const CATEGORY_ICONS = {
  coffee: "☕",
  "non-coffee": "🥤",
  tea: "🍵",
  dessert: "🍰",
};

let activeCategoryId = "all";

function renderCategoryTabs() {
  const tabsEl = document.getElementById("category-tabs");
  const allTabs = [{ id: "all", name: "전체" }, ...CATEGORIES];

  tabsEl.innerHTML = allTabs
    .map(
      (category) => `
        <button
          class="category-tab ${category.id === activeCategoryId ? "active" : ""}"
          data-category-id="${category.id}"
        >${category.name}</button>
      `
    )
    .join("");

  tabsEl.querySelectorAll(".category-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      activeCategoryId = tab.dataset.categoryId;
      renderCategoryTabs();
      renderMenuGrid();
    });
  });
}

function renderMenuGrid() {
  const gridEl = document.getElementById("menu-grid");
  const menus = getMenusByCategory(activeCategoryId);

  if (menus.length === 0) {
    gridEl.innerHTML = `<p class="empty-state">등록된 메뉴가 없습니다.</p>`;
    return;
  }

  gridEl.innerHTML = menus
    .map(
      (menu) => `
        <article class="menu-card glass" data-menu-id="${menu.id}">
          ${menu.isNew ? `<span class="badge">NEW</span>` : ""}
          <div class="thumb">${CATEGORY_ICONS[menu.categoryId] || "☕"}</div>
          <p class="name">${menu.name}</p>
          <p class="price">${formatPrice(menu.price)}</p>
        </article>
      `
    )
    .join("");

  gridEl.querySelectorAll(".menu-card").forEach((card) => {
    card.addEventListener("click", () => {
      window.location.href = `detail.html?id=${card.dataset.menuId}`;
    });
  });
}

renderCategoryTabs();
renderMenuGrid();
