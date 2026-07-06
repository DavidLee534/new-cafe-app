/* ==========================================================================
   메뉴 / 카테고리 데이터
   ========================================================================== */

const CATEGORIES = [
  { id: "coffee", name: "커피" },
  { id: "non-coffee", name: "논커피" },
  { id: "tea", name: "티" },
  { id: "dessert", name: "디저트" },
];

const MENUS = [
  {
    id: 1,
    categoryId: "coffee",
    name: "아메리카노",
    price: 4500,
    description: "깊고 진한 에스프레소에 물을 더한 클래식 커피",
    image: "",
    hasTemperatureOption: true,
    isPopular: true,
    isNew: false,
  },
  {
    id: 2,
    categoryId: "coffee",
    name: "카페라떼",
    price: 5000,
    description: "부드러운 우유와 에스프레소의 조화",
    image: "",
    hasTemperatureOption: true,
    isPopular: true,
    isNew: false,
  },
  {
    id: 3,
    categoryId: "coffee",
    name: "바닐라라떼",
    price: 5500,
    description: "달콤한 바닐라 시럽이 더해진 라떼",
    image: "",
    hasTemperatureOption: true,
    isPopular: false,
    isNew: false,
  },
  {
    id: 4,
    categoryId: "coffee",
    name: "카푸치노",
    price: 5000,
    description: "풍성한 우유 거품이 매력적인 커피",
    image: "",
    hasTemperatureOption: true,
    isPopular: false,
    isNew: false,
  },
  {
    id: 5,
    categoryId: "non-coffee",
    name: "초콜릿라떼",
    price: 5500,
    description: "진한 초콜릿과 우유의 달콤한 만남",
    image: "",
    hasTemperatureOption: true,
    isPopular: false,
    isNew: false,
  },
  {
    id: 6,
    categoryId: "non-coffee",
    name: "딸기스무디",
    price: 6000,
    description: "상큼한 딸기로 만든 시원한 스무디",
    image: "",
    hasTemperatureOption: false,
    isPopular: true,
    isNew: true,
  },
  {
    id: 7,
    categoryId: "tea",
    name: "얼그레이",
    price: 4800,
    description: "은은한 베르가못 향의 홍차",
    image: "",
    hasTemperatureOption: true,
    isPopular: false,
    isNew: false,
  },
  {
    id: 8,
    categoryId: "tea",
    name: "캐모마일",
    price: 4800,
    description: "편안한 휴식을 위한 허브티",
    image: "",
    hasTemperatureOption: true,
    isPopular: false,
    isNew: false,
  },
  {
    id: 9,
    categoryId: "dessert",
    name: "크로플",
    price: 6500,
    description: "바삭하고 촉촉한 크로플",
    image: "",
    hasTemperatureOption: false,
    isPopular: true,
    isNew: false,
  },
  {
    id: 10,
    categoryId: "dessert",
    name: "치즈케이크",
    price: 7000,
    description: "진하고 부드러운 뉴욕 치즈케이크",
    image: "",
    hasTemperatureOption: false,
    isPopular: false,
    isNew: true,
  },
];

function getCategoryById(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId) || null;
}

function getMenuById(menuId) {
  return MENUS.find((menu) => menu.id === Number(menuId)) || null;
}

function getMenusByCategory(categoryId) {
  if (!categoryId || categoryId === "all") {
    return MENUS;
  }
  return MENUS.filter((menu) => menu.categoryId === categoryId);
}
