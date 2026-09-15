import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { fetchOrderById, reportRemittance } from "../api/orders";
import { submitWishlist } from "../api/feedback";
import { BANK_INFO } from "../data/bankInfo";
import "./ThankYou.css";

export default function ThankYou() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [last5, setLast5] = useState("");
  const [error, setError] = useState("");
  const [reported, setReported] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [wishlist, setWishlist] = useState("");
  const [otherMessage, setOtherMessage] = useState("");
  const [wishlistSubmitted, setWishlistSubmitted] = useState(false);
  const [wishlistSubmitting, setWishlistSubmitting] = useState(false);

  useEffect(() => {
    if (order) return;
    let alive = true;
    fetchOrderById(orderId).then((data) => {
      if (alive) {
        setOrder(data);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [orderId, order]);

  async function handleReport(e) {
    e.preventDefault();
    if (!/^\d{5}$/.test(last5)) {
      setError("請輸入匯款帳號後五碼（5 位數字）");
      return;
    }
    setError("");

    const payload = { orderId, last5 };
    // TODO: Call API here
    console.log("[ThankYou] report remittance payload:", payload);

    setSubmitting(true);
    try {
      await reportRemittance(orderId, last5);
      setReported(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleWishlistSubmit(e) {
    e.preventDefault();
    if (!wishlist.trim() && !otherMessage.trim()) return;

    const payload = {
      orderId,
      wishlist: wishlist.trim(),
      otherMessage: otherMessage.trim(),
    };
    // TODO: Call API here
    console.log("[ThankYou] wishlist payload:", payload);

    setWishlistSubmitting(true);
    try {
      await submitWishlist(payload);
      setWishlistSubmitted(true);
    } finally {
      setWishlistSubmitting(false);
    }
  }

  if (loading) {
    return <div className="container" style={{ padding: "80px 0" }}>載入中…</div>;
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <h2>找不到這筆訂單</h2>
        <Link to="/" className="btn btn-outline" style={{ marginTop: 16 }}>
          回到首頁
        </Link>
      </div>
    );
  }

  return (
    <div className="container thank-you">
      <div className="ty-hero">
        <div className="ty-check">✓</div>
        <h1>感謝您的訂購！</h1>
        <p>我們已收到您的訂單，請完成匯款並回報後五碼，以便我們儘快為您出貨。</p>
      </div>

      <div className="ty-card">
        <div className="ty-order-row">
          <span>訂單編號</span>
          <strong>{order.id}</strong>
        </div>

        <ul className="ty-items">
          {order.items.map((it) => (
            <li key={it.id}>
              <span>
                {it.name} × {it.qty}
              </span>
              <span>NT$ {it.price * it.qty}</span>
            </li>
          ))}
        </ul>

        {order.totalSavings > 0 && (
          <div className="ty-savings-row">
            <span>您已省下</span>
            <span>NT$ {order.totalSavings}</span>
          </div>
        )}
        <div className="ty-total-row">
          <span>總金額</span>
          <span>NT$ {order.total}</span>
        </div>
      </div>

      <div className="ty-card">
        <h2>匯款資訊</h2>
        <div className="ty-bank-info">
          <div className="ty-bank-row">
            <span>銀行</span>
            <strong>{BANK_INFO.bankName}</strong>
          </div>
          <div className="ty-bank-row">
            <span>分行</span>
            <strong>{BANK_INFO.branch}</strong>
          </div>
          <div className="ty-bank-row">
            <span>帳號</span>
            <strong>{BANK_INFO.account}</strong>
          </div>
          <div className="ty-bank-row">
            <span>戶名</span>
            <strong>{BANK_INFO.holder}</strong>
          </div>
        </div>
        <p className="ty-bank-note">
          請於送出訂單後 3 日內完成匯款，並在下方回報「匯款帳號後五碼」，
          以利我們儘速為您核對款項與出貨。逾期未付款訂單將視同取消。
        </p>
      </div>

      <div className="ty-card ty-remit-card">
        <h2>回報匯款後五碼</h2>
        {reported ? (
          <p className="ty-reported-msg">已收到您的對帳資訊，我們將盡快為您核對款項，謝謝！</p>
        ) : (
          <form className="ty-remit-form" onSubmit={handleReport}>
            <label>
              <span>匯款帳號後五碼</span>
              <input
                value={last5}
                onChange={(e) => setLast5(e.target.value)}
                placeholder="例如：88213"
                inputMode="numeric"
                maxLength={5}
              />
            </label>
            {error && <em>{error}</em>}
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? "送出中…" : "送出對帳資訊"}
            </button>
          </form>
        )}

        {reported && (
          <div className="ty-wishlist">
            <h3>專屬於您的許願清單：</h3>
            <p className="ty-wishlist-desc">
              謝謝您的支持！如果您還有想入手的品牌或商品，歡迎留言告訴我們，
              我們會列入下次團購的口袋名單 🛋️
            </p>
            {wishlistSubmitted ? (
              <p className="ty-wishlist-done">已收到您的願望清單，謝謝分享！我們會認真參考 💛</p>
            ) : (
              <form className="ty-wishlist-form" onSubmit={handleWishlistSubmit}>
                <textarea
                  value={wishlist}
                  onChange={(e) => setWishlist(e.target.value)}
                  placeholder="品牌/商品名稱，如：Momcozy 免手持擠奶器、LTD 蝶型包巾"
                  rows={3}
                />
                <label className="ty-other-label">
                  <span>其他想跟我們分享的話</span>
                  <textarea
                    value={otherMessage}
                    onChange={(e) => setOtherMessage(e.target.value)}
                    placeholder="任何建議、心得或想對我們說的話都歡迎"
                    rows={3}
                  />
                </label>
                <button
                  type="submit"
                  className="btn btn-outline"
                  disabled={wishlistSubmitting || (!wishlist.trim() && !otherMessage.trim())}
                >
                  {wishlistSubmitting ? "送出中…" : "送出願望清單"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <div className="ty-back">
        <Link to="/" className="btn btn-outline">
          繼續選購
        </Link>
      </div>
    </div>
  );
}
