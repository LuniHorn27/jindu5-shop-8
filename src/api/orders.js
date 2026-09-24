// ============================================================
// 訂單相關 API 函數
// 已串接真正的後端（FastAPI + MySQL），呼叫端 (components/pages)
// 完全不需要更動。
// ============================================================
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * 建立訂單（結帳送出）
 * @param {Object} payload
 * @returns {Promise<Object>} 建立後的訂單物件（含訂單編號）
 */
export async function createOrder(payload) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("建立訂單失敗");
  return res.json();
}

/**
 * 回報匯款後五碼
 * @param {string} orderId
 * @param {string} last5
 * @returns {Promise<Object>} 更新後的訂單物件
 */
export async function reportRemittance(orderId, last5) {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/remittance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ last5 }),
  });
  if (!res.ok) throw new Error("回報匯款失敗");
  return res.json();
}

/**
 * 依訂單編號取得單筆訂單
 * @param {string} orderId
 * @returns {Promise<Object|null>}
 */
export async function fetchOrderById(orderId) {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("取得訂單失敗");
  return res.json();
}

/**
 * 後台：取得所有訂單
 * @returns {Promise<Array>}
 */
export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/api/orders`);
  if (!res.ok) throw new Error("取得訂單列表失敗");
  return res.json();
}

/**
 * 後台：切換訂單付款狀態
 * @param {string} orderId
 * @param {"待付款"|"已付款"} newStatus
 * @returns {Promise<Object>} 更新後的訂單物件
 */
export async function updateOrderStatus(orderId, newStatus) {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!res.ok) throw new Error("更新訂單狀態失敗");
  return res.json();
}
