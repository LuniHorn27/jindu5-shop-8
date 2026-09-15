import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "./CartDrawer.css";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQty, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`cart-overlay ${isDrawerOpen ? "is-open" : ""}`}
        onClick={closeDrawer}
        aria-hidden={!isDrawerOpen}
      />
      <aside
        className={`cart-drawer ${isDrawerOpen ? "is-open" : ""}`}
        role="dialog"
        aria-label="購物車"
        aria-hidden={!isDrawerOpen}
      >
        <div className="cart-drawer-head">
          <h2>購物車</h2>
          <button className="cart-close" onClick={closeDrawer} aria-label="關閉購物車">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>購物車還是空的，去挑幾件安心好物吧。</p>
            <button className="btn btn-outline" onClick={closeDrawer}>
              繼續選購
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((it) => (
                <li key={it.id} className="cart-item">
                  <img src={it.thumbnail} alt={it.name} />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{it.name}</p>
                    <p className="cart-item-price">NT$ {it.price}</p>
                    <div className="cart-item-qty">
                      <button
                        onClick={() => updateQty(it.id, it.qty - 1)}
                        aria-label="減少數量"
                      >
                        −
                      </button>
                      <span>{it.qty}</span>
                      <button
                        onClick={() => updateQty(it.id, it.qty + 1)}
                        aria-label="增加數量"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(it.id)}
                    aria-label={`移除 ${it.name}`}
                  >
                    刪除
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-drawer-footer">
              <div className="cart-total-row">
                <span>總金額</span>
                <span className="cart-total-amount">NT$ {totalPrice}</span>
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={() => {
                  closeDrawer();
                  navigate("/checkout");
                }}
              >
                前往結帳
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
