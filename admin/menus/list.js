// 전역 메뉴 데이터 및 상태 관리
let currentMenus = [];
let activeCategory = "all";
let searchKeyword = "";
let deleteTargetId = null;

// DOM 요소
const menuGrid = document.getElementById("menuGrid");
const emptyState = document.getElementById("emptyState");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const deleteModal = document.getElementById("deleteModal");
const deleteTargetNameSpan = document.getElementById("deleteTargetName");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// 초기화 실행
document.addEventListener("DOMContentLoaded", () => {
  // LocalStorage로부터 메뉴 데이터를 불러옴 (없다면 js/data.js 데이터 활용)
  currentMenus = getStoredMenus();
  
  initCategoryFilters();
  renderMenus();
  setupEventListeners();
});

// 카테고리 필터 버튼 렌더링
function initCategoryFilters() {
  // CATEGORIES는 js/data.js에 정의된 전역 배열
  CATEGORIES.forEach(category => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.setAttribute("data-category", category.id);
    btn.textContent = category.name;
    categoryFilters.appendChild(btn);
  });
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 카테고리 필터 버튼 클릭
  categoryFilters.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      // 기존 active 제거
      const activeBtn = categoryFilters.querySelector(".filter-btn.active");
      if (activeBtn) activeBtn.classList.remove("active");

      // 현재 버튼 active 추가
      e.target.classList.add("active");
      activeCategory = e.target.getAttribute("data-category");
      renderMenus();
    }
  });

  // 검색어 입력
  searchInput.addEventListener("input", (e) => {
    searchKeyword = e.target.value.trim().toLowerCase();
    renderMenus();
  });

  // 삭제 확정 버튼 클릭
  confirmDeleteBtn.addEventListener("click", () => {
    if (deleteTargetId !== null) {
      deleteMenu(deleteTargetId);
      currentMenus = getStoredMenus(); // 데이터 갱신
      closeDeleteModal();
      renderMenus();
    }
  });
}

// 메뉴 목록 렌더링
function renderMenus() {
  // 필터링 적용
  const filteredMenus = currentMenus.filter(menu => {
    const matchCategory = activeCategory === "all" || menu.categoryId === activeCategory;
    const matchSearch = menu.name.toLowerCase().includes(searchKeyword);
    return matchCategory && matchSearch;
  });

  // 화면 비우기
  menuGrid.innerHTML = "";

  if (filteredMenus.length === 0) {
    menuGrid.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  menuGrid.style.display = "grid";
  emptyState.style.display = "none";

  filteredMenus.forEach(menu => {
    const category = getCategoryById(menu.categoryId);
    const categoryName = category ? category.name : "미지정";
    
    // 카드 엘리먼트 생성
    const card = document.createElement("div");
    card.className = "menu-card glass";
    
    // 배지 HTML 생성
    let badgesHtml = "";
    if (menu.isPopular) {
      badgesHtml += `<span class="badge badge-popular">인기</span>`;
    }
    if (menu.isNew) {
      badgesHtml += `<span class="badge badge-new">신규</span>`;
    }

    card.innerHTML = `
      <div class="menu-image-container">
        <div class="menu-badges">${badgesHtml}</div>
        <img src="${menu.image}" alt="${menu.name}" onerror="this.src='https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60'">
        <span class="menu-category-tag">${categoryName}</span>
      </div>
      <div class="menu-info">
        <h3 class="menu-name">${menu.name}</h3>
        <p class="menu-desc">${menu.description || "설명이 등록되지 않았습니다."}</p>
        <div class="menu-meta">
          <span class="menu-price">${formatPrice(menu.price)}</span>
          <span class="menu-options">${menu.hasTemperatureOption ? "ICE/HOT 선택" : "온도 고정"}</span>
        </div>
      </div>
      <div class="menu-actions">
        <div class="action-btn" onclick="goToDetail(${menu.id})">🔍 상세</div>
        <div class="action-btn" onclick="goToEdit(${menu.id})">✏️ 수정</div>
        <div class="action-btn btn-delete-hover" onclick="openDeleteModal(${menu.id}, '${menu.name}')">🗑️ 삭제</div>
      </div>
    `;
    
    menuGrid.appendChild(card);
  });
}

// 페이지 이동 헬퍼
function goToDetail(id) {
  window.location.href = `detail.html?id=${id}`;
}

function goToEdit(id) {
  window.location.href = `edit.html?id=${id}`;
}

// 모달 관리
function openDeleteModal(id, name) {
  deleteTargetId = id;
  deleteTargetNameSpan.textContent = name;
  deleteModal.classList.add("active");
}

function closeDeleteModal() {
  deleteTargetId = null;
  deleteModal.classList.remove("active");
}
