# 媽媽沙發 X 淨毒五郎（純前端 Mock 版）

以 React + React Router 打造的多頁面團購電商網站，目前使用 Mock Data，
所有對外資料存取都已抽成獨立的 API 函數，方便日後串接真實後端。

## 開發環境啟動

```bash
npm install
npm run dev
```

打開瀏覽器進入 http://localhost:5173 即可預覽。

## 建置正式版本

```bash
npm run build   # 產出 dist/ 資料夾
npm run preview # 本地預覽建置結果
```

## 專案結構

```
src/
  api/                後端串接層（未來只需改這裡）
    products.js       fetchProducts(), fetchProductById()
    orders.js         createOrder(), reportRemittance(),
                       fetchOrders(), fetchOrderById(), updateOrderStatus()
  data/                Mock 資料來源
    mockProducts.js
    mockOrders.js
  context/
    CartContext.jsx    全域購物車狀態（React Context）
  components/
    Navbar.jsx          導覽列：搜尋、分類、排序、漢堡選單
    CartDrawer.jsx       側邊滑出購物車
    ProductCard.jsx      商品卡片
    Footer.jsx           頁尾（退換貨政策／客服資訊）
  pages/
    Home.jsx             首頁（商品列表）
    ProductDetail.jsx     商品詳情頁 /product/:id
    Checkout.jsx          結帳頁 /checkout
    ThankYou.jsx           感謝與對帳頁 /thank-you/:orderId
    Admin.jsx               後台管理 /admin
```

## 串接真實後端時該怎麼做

所有「對外」的動作都已經集中在 `src/api/products.js` 與 `src/api/orders.js`
兩個檔案裡，且函數簽名（輸入 / 輸出格式）已經設計成貼近未來會呼叫的
REST API。只要把函數內部的 Mock 邏輯換成 `fetch(...)`，其餘頁面與元件
完全不需要更動。

每個函數內都留有註解：

```js
// TODO: Call API here — 之後改為：
// const res = await fetch('/api/orders', { method: 'POST', ... });
// return res.json();
```

以下互動事件也都印出了目前準備送出的 Payload（開啟瀏覽器 Console 可查看）：

- 結帳頁送出訂單（`Checkout.jsx` → `createOrder`）
- 對帳頁回報匯款後五碼（`ThankYou.jsx` → `reportRemittance`）
- 後台切換訂單付款狀態（`Admin.jsx` → `updateOrderStatus`）

## 設計風格

參考「媽媽沙發 MamaSofa」的溫暖居家調性：
燕麥米白背景、大地色文字、低飽和草本綠按鈕、圓潤邊角與大量留白，
標題採用 Noto Serif TC，內文採用 Noto Sans TC。

## 後台管理

前往 `/admin` 進入後台（目前無登入驗證，純展示用），
可查看所有 Mock 訂單並切換「待付款／已付款」狀態。
