// ============================================================
// 商品相關 API 函數
// 已串接真正的後端（FastAPI + MySQL），呼叫端 (components/pages)
// 完全不需要更動。
// ============================================================
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * 取得商品列表
 * @param {Object} params
 * @param {string} [params.keyword] 關鍵字搜尋
 * @param {string} [params.category] 分類 id
 * @param {"price-asc"|"price-desc"} [params.sort] 排序方式
 * @param {boolean} [params.includeUnpublished] 是否包含已下架商品（後台用）
 * @returns {Promise<Array>}
 */
export async function fetchProducts(params = {}) {
  const { keyword = "", category = "", sort = "", includeUnpublished = false } = params;
  const query = new URLSearchParams();
  if (keyword) query.set("keyword", keyword);
  if (category) query.set("category", category);
  if (sort) query.set("sort", sort);
  if (includeUnpublished) query.set("includeUnpublished", "true");

  const res = await fetch(`${API_BASE}/api/products?${query}`);
  if (!res.ok) throw new Error("取得商品列表失敗");
  return res.json();
}

/**
 * 依 id 取得單一商品詳情
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("取得商品詳情失敗");
  return res.json();
}

/**
 * 後台：更新商品（價格／分類／上下架）
 * @param {string} id
 * @param {Object} changes
 * @returns {Promise<Object>} 更新後的商品物件
 */
export async function updateProduct(id, changes) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error("更新商品失敗");
  return res.json();
}
