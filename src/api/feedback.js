// ============================================================
// 顧客意見相關 API 函數
// 目前皆為 Mock 實作，日後串接後端時，只需修改此檔案內部邏輯
// （改為 fetch('/api/wishlist', { method: 'POST', ... }) 等），
// 呼叫端 (components/pages) 不需更動。
// ============================================================
const FAKE_LATENCY = 250;

function delay(data, ms = FAKE_LATENCY) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/**
 * 送出「還想團購什麼」願望清單 + 其他留言
 * @param {Object} payload
 * @param {string} payload.orderId 對應的訂單編號
 * @param {string} payload.wishlist 使用者填寫的品牌／商品內容
 * @param {string} payload.otherMessage 其他想分享的話
 * @returns {Promise<Object>} { success: boolean }
 */
export async function submitWishlist(payload) {
  // TODO: Call API here — 之後改為：
  // const res = await fetch('/api/wishlist', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // return res.json();
  console.log("[Mock API] submitWishlist payload:", JSON.stringify(payload, null, 2));
  return delay({ success: true });
}
