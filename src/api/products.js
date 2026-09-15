// ============================================================
// 商品相關 API 函數
// 目前皆為 Mock 實作，日後串接後端時，只需修改此檔案內部邏輯
// （改為 fetch('/api/products') 等），呼叫端 (components/pages)
// 完全不需要更動。
// ============================================================
import { mockProducts } from "../data/mockProducts";

const FAKE_LATENCY = 350;

function delay(data, ms = FAKE_LATENCY) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/**
 * 取得商品列表
 * @param {Object} params
 * @param {string} [params.keyword] 關鍵字搜尋
 * @param {string} [params.category] 分類 id
 * @param {"price-asc"|"price-desc"} [params.sort] 排序方式
 * @returns {Promise<Array>}
 */
export async function fetchProducts(params = {}) {
  const { keyword = "", category = "", sort = "" } = params;
  let list = [...mockProducts];

  if (keyword.trim()) {
    const kw = keyword.trim().toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(kw));
  }

  if (category) {
    list = list.filter((p) => p.category === category);
  }

  if (sort === "price-asc") {
    list.sort((a, b) => a.salePrice - b.salePrice);
  } else if (sort === "price-desc") {
    list.sort((a, b) => b.salePrice - a.salePrice);
  }

  // TODO: Call API here — 之後改為：
  // const res = await fetch(`/api/products?${new URLSearchParams(params)}`);
  // return res.json();
  return delay(list);
}

/**
 * 依 id 取得單一商品詳情
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function fetchProductById(id) {
  const found = mockProducts.find((p) => p.id === id) || null;
  // TODO: Call API here — 之後改為：
  // const res = await fetch(`/api/products/${id}`);
  // return res.json();
  return delay(found);
}
