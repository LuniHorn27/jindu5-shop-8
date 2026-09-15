import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  function handleQuickAdd(e) {
    // 卡片本身是可點擊連結，這裡要阻止事件冒泡，避免誤觸發跳轉到詳情頁
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-img">
        <img src={product.thumbnail} alt={product.name} loading="lazy" />
        <button
          type="button"
          className="product-card-quick-add"
          onClick={handleQuickAdd}
          aria-label={`將「${product.name}」加入購物車`}
          title="加入購物車"
        >
          <CartPlusIcon />
        </button>
      </div>
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p className="product-card-desc">{product.shortDesc}</p>
        <div className="product-card-price">
          <span className="price-sale">NT$ {product.salePrice}</span>
          <span className="price-origin">NT$ {product.price}</span>
        </div>
      </div>
    </Link>
  );
}

function CartPlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4h2l2.4 11.4A2 2 0 0 0 9.35 17h7.3a2 2 0 0 0 1.95-1.6L20 8H6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20.5" r="1.3" fill="currentColor" />
      <circle cx="17" cy="20.5" r="1.3" fill="currentColor" />
      <path d="M13 8.5v4M11 10.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
