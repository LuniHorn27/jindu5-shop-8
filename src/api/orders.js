// ============================================================
// 訂單相關 API 函數
// 目前皆為 Mock 實作，日後串接後端時，只需修改此檔案內部邏輯，
// 呼叫端 (components/pages) 完全不需要更動。
// ============================================================
import { mockOrders } from "../data/mockOrders";

const FAKE_LATENCY = 350;
let orders = [...mockOrders]; // 記憶體暫存，重新整理頁面會重置

function delay(data, ms = FAKE_LATENCY) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

function generateOrderId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900 + 100);
  return `JD${y}${m}${d}${rand}`;
}

/**
 * 建立訂單（結帳送出）
 * @param {Object} payload
 * @returns {Promise<Object>} 建立後的訂單物件（含訂單編號）
 */
export async function createOrder(payload) {
  const order = {
    id: generateOrderId(),
    ...payload,
    status: "待付款",
    remitLast5: "",
    createdAt: new Date().toLocaleString("zh-TW", { hour12: false }),
  };
  orders = [order, ...orders];

  // TODO: Call API here — 之後改為：
  // const res = await fetch('/api/orders', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // return res.json();
  return delay(order);
}

/**
 * 回報匯款後五碼
 * @param {string} orderId
 * @param {string} last5
 * @returns {Promise<Object>} { success: boolean }
 */
export async function reportRemittance(orderId, last5) {
  orders = orders.map((o) => (o.id === orderId ? { ...o, remitLast5: last5 } : o));

  // TODO: Call API here
  return delay({ success: true });
}

/**
 * 依訂單編號取得單筆訂單
 * @param {string} orderId
 * @returns {Promise<Object|null>}
 */
export async function fetchOrderById(orderId) {
  const found = orders.find((o) => o.id === orderId) || null;
  // TODO: Call API here
  return delay(found);
}

/**
 * 後台：取得所有訂單
 * @returns {Promise<Array>}
 */
export async function fetchOrders() {
  // TODO: Call API here
  return delay([...orders]);
}

/**
 * 後台：切換訂單付款狀態
 * @param {string} orderId
 * @param {"待付款"|"已付款"} newStatus
 * @returns {Promise<Object>} { success: boolean }
 */
export async function updateOrderStatus(orderId, newStatus) {
  orders = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));

  // TODO: Call API here
  return delay({ success: true });
}
