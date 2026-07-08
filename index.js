/* ==========================================================================
   메인 (포털) 페이지 로직
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // UI 요소 참조
  const statMenusCount = document.getElementById("stat-menus-count");
  const statOrdersCount = document.getElementById("stat-orders-count");
  const statCartCount = document.getElementById("stat-cart-count");

  const btnResetData = document.getElementById("btn-reset-data");
  const btnAddMockOrder = document.getElementById("btn-add-mock-order");
  const btnClearCart = document.getElementById("btn-clear-cart");

  const toastEl = document.getElementById("toast");

  // 토스트 메시지 유틸리티
  function showToast(message, isWarning = false) {
    toastEl.textContent = message;
    toastEl.style.display = "flex";
    toastEl.className = "toast show";
    
    if (isWarning) {
      toastEl.style.borderLeft = "4px solid var(--color-danger)";
    } else {
      toastEl.style.borderLeft = "4px solid var(--color-accent)";
    }

    // 기존 타이머 제거 후 재생성
    if (window.toastTimer) {
      clearTimeout(window.toastTimer);
    }
    
    window.toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
      setTimeout(() => {
        toastEl.style.display = "none";
      }, 300);
    }, 2500);
  }

  // 통계 업데이트
  function updateStats() {
    // 1. 등록된 메뉴 개수
    try {
      const menus = getStoredMenus();
      statMenusCount.textContent = `${menus.length}개`;
    } catch (e) {
      statMenusCount.textContent = "0개";
    }

    // 2. 누적 주문 수
    try {
      const orders = getOrders();
      statOrdersCount.textContent = `${orders.length}건`;
    } catch (e) {
      statOrdersCount.textContent = "0건";
    }

    // 3. 장바구니 수량
    try {
      const cartCount = getCartCount();
      statCartCount.textContent = `${cartCount}개`;
    } catch (e) {
      statCartCount.textContent = "0개";
    }

    // 헤더 카트 배지 동기화
    if (typeof updateCartBadge === "function") {
      updateCartBadge();
    }
  }

  // 초기화 이벤트
  btnResetData.addEventListener("click", () => {
    if (confirm("정말로 모든 데이터를 기본 상태로 초기화하시겠습니까?\n(등록된 메뉴 정보와 주문 내역, 장바구니가 모두 기본값으로 리셋됩니다.)")) {
      // 로컬 스토리지 삭제
      localStorage.removeItem("cafe-app-menus");
      localStorage.removeItem("cafe-app-orders");
      localStorage.removeItem("cafe-app-cart");

      // 다시 로드하여 초기 데이터 셋팅
      if (typeof getStoredMenus === "function") {
        getStoredMenus();
      }
      
      showToast("🔄 모든 데이터가 초기값으로 리셋되었습니다.");
      updateStats();
    }
  });

  // 임의 주문 생성 이벤트
  btnAddMockOrder.addEventListener("click", () => {
    try {
      const menus = getStoredMenus();
      if (!menus || menus.length === 0) {
        showToast("⚠️ 등록된 메뉴가 없어 주문을 만들 수 없습니다.", true);
        return;
      }

      // 무작위 1~2개 상품 선택
      const itemCount = Math.floor(Math.random() * 2) + 1;
      const items = [];

      for (let i = 0; i < itemCount; i++) {
        const randomMenu = menus[Math.floor(Math.random() * menus.length)];
        const temp = randomMenu.hasTemperatureOption ? (Math.random() > 0.5 ? "ICE" : "HOT") : null;
        const quantity = Math.floor(Math.random() * 2) + 1; // 1~2개

        const existing = items.find(it => it.menuId === randomMenu.id && it.temperature === temp);
        if (existing) {
          existing.quantity += quantity;
        } else {
          items.push({
            menuId: randomMenu.id,
            name: randomMenu.name,
            price: randomMenu.price,
            temperature: temp,
            quantity: quantity
          });
        }
      }

      // 주문 데이터 추가 저장
      const rawOrders = localStorage.getItem("cafe-app-orders");
      const storedOrders = rawOrders ? JSON.parse(rawOrders) : (typeof ORDERS !== "undefined" ? ORDERS : []);
      const nextId = storedOrders.length > 0 ? Math.max(...storedOrders.map(o => o.id)) + 1 : 1001;

      const newOrder = {
        id: nextId,
        orderDate: new Date().toISOString(),
        status: "주문완료",
        items: items
      };

      storedOrders.unshift(newOrder); // 최신 주문이 앞으로 오도록 앞에 삽입
      localStorage.setItem("cafe-app-orders", JSON.stringify(storedOrders));

      showToast(`🎉 새로운 가상 주문 #${nextId}번이 생성되었습니다!`);
      updateStats();
    } catch (error) {
      console.error(error);
      showToast("⚠️ 주문 생성 도중 오류가 발생했습니다.", true);
    }
  });

  // 장바구니 비우기 이벤트
  btnClearCart.addEventListener("click", () => {
    try {
      const cartCount = getCartCount();
      if (cartCount === 0) {
        showToast("💡 장바구니가 이미 비어있습니다.");
        return;
      }
      
      if (confirm("장바구니의 모든 품목을 비우시겠습니까?")) {
        if (typeof clearCart === "function") {
          clearCart();
        }
        showToast("🗑️ 장바구니가 깨끗하게 비워졌습니다.");
        updateStats();
      }
    } catch (e) {
      showToast("⚠️ 장바구니 비우기 오류가 발생했습니다.", true);
    }
  });

  // 초기 진입 시 실행
  updateStats();
});
