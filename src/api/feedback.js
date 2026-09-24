// ============================================================
// 顧客意見相關 API 函數
// 已串接真正的後端（FastAPI + MySQL），呼叫端 (components/pages)
// 不需更動。
// ============================================================
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * 送出「還想團購什麼」願望清單 + 其他留言
 * @param {Object} payload
 * @param {string} payload.orderId 對應的訂單編號
 * @param {string} payload.wishlist 使用者填寫的品牌／商品內容
 * @param {string} payload.otherMessage 其他想分享的話
 * @returns {Promise<Object>} 建立後的許願清單物件
 */
export async function submitWishlist(payload) {
  const res = await fetch(`${API_BASE}/api/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("送出許願清單失敗");
  return res.json();
}

/**
 * 後台：取得所有許願清單
 * @returns {Promise<Array>}
 */
export async function fetchWishlist() {
  const res = await fetch(`${API_BASE}/api/wishlist`);
  if (!res.ok) throw new Error("取得許願清單失敗");
  return res.json();
}
