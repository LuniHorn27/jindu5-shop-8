import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { createOrder } from "../api/orders";
import { BANK_INFO } from "../data/bankInfo";
import "./Checkout.css";

export default function Checkout() {
  const { items, totalPrice, totalSavings, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ buyerName: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function validate() {
    const errs = {};
    if (!form.buyerName.trim()) errs.buyerName = "請輸入姓名";
    if (!/^09\d{8}$/.test(form.phone.trim())) errs.phone = "請輸入正確的手機號碼（如 0912345678）";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = "請輸入正確的 Email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate() || items.length === 0) return;

    const payload = {
      buyerName: form.buyerName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      items: items.map((it) => ({ id: it.id, name: it.name, qty: it.qty, price: it.price })),
      total: totalPrice,
      totalSavings,
      paymentMethod: "ATM_TRANSFER",
    };

    // TODO: Call API here
    console.log("[Checkout] submit payload:", payload);

    setSubmitting(true);
    try {
      const order = await createOrder(payload);
      clearCart();
      navigate(`/thank-you/${order.id}`, { state: { order } });
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <h2>購物車是空的</h2>
        <p style={{ color: "var(--color-text-soft)" }}>請先挑選商品再回來結帳唷。</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
          去逛逛商品
        </Link>
      </div>
    );
  }

  return (
    <div className="container checkout">
      <h1 className="checkout-title">結帳</h1>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h2>買家資訊</h2>

          <label className="field">
            <span>姓名</span>
            <input
              name="buyerName"
              value={form.buyerName}
              onChange={handleChange}
              placeholder="請輸入收件人姓名"
            />
            {errors.buyerName && <em>{errors.buyerName}</em>}
          </label>

          <label className="field">
            <span>手機號碼</span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="09XXXXXXXX"
              inputMode="numeric"
            />
            {errors.phone && <em>{errors.phone}</em>}
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
            {errors.email && <em>{errors.email}</em>}
          </label>

          <h2 className="checkout-payment-title">付款方式</h2>
          <div className="payment-method">
            <div className="payment-method-radio">
              <span className="radio-dot" />
              ATM 銀行轉帳
            </div>
            <div className="bank-info">
              <div className="bank-info-row">
                <span>銀行</span>
                <strong>{BANK_INFO.bankName}</strong>
              </div>
              <div className="bank-info-row">
                <span>分行</span>
                <strong>{BANK_INFO.branch}</strong>
              </div>
              <div className="bank-info-row">
                <span>帳號</span>
                <strong>{BANK_INFO.account}</strong>
              </div>
              <div className="bank-info-row">
                <span>戶名</span>
                <strong>{BANK_INFO.holder}</strong>
              </div>
              <p className="bank-note">
                請於送出訂單後 3 日內完成匯款，並於下一步回報「匯款帳號後五碼」，
                以利我們儘速為您核對款項與出貨。逾期未付款訂單將視同取消。
              </p>
            </div>
          </div>

          <button className="btn btn-primary btn-block checkout-submit" disabled={submitting}>
            {submitting ? "送出中…" : "送出訂單"}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>訂單明細</h2>
          <ul className="summary-list">
            {items.map((it) => (
              <li key={it.id}>
                <span>
                  {it.name} × {it.qty}
                </span>
                <span>NT$ {it.price * it.qty}</span>
              </li>
            ))}
          </ul>
          {totalSavings > 0 && (
            <div className="summary-savings">
              <span>您已省下</span>
              <span>NT$ {totalSavings}</span>
            </div>
          )}
          <div className="summary-total">
            <span>總金額</span>
            <span>NT$ {totalPrice}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
