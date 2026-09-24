import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../api/products";
import { useCart } from "../context/CartContext.jsx";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setQty(1);
    setActiveImg(0);
    fetchProductById(id).then((data) => {
      if (alive) {
        setProduct(data);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: "80px 0" }}>載入中…</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <h2>找不到這項商品</h2>
        <Link to="/" className="btn btn-outline" style={{ marginTop: 16 }}>
          回到商品列表
        </Link>
      </div>
    );
  }

  function handleAdd() {
    addItem(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  const subtotal = product.salePrice * qty;
  const savings = (product.price - product.salePrice) * qty;

  return (
    <div className="container product-detail">
      <nav className="breadcrumb">
        <Link to="/">商品列表</Link> <span>/</span> <span>{product.name}</span>
      </nav>

      <div className="pd-top">
        <div className="pd-gallery">
          <div className="pd-gallery-main">
            <img src={product.gallery[activeImg]} alt={product.name} />
          </div>
          {product.gallery.length > 1 && (
            <div className="pd-gallery-thumbs">
              {product.gallery.map((src, i) => (
                <button
                  key={src}
                  className={`pd-thumb ${i === activeImg ? "is-active" : ""}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`第 ${i + 1} 張圖片`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          <h1 className="pd-name">{product.name}</h1>
          <p className="pd-short">{product.shortDesc}</p>

          <div className="pd-price-row">
            <span className="pd-price-sale">NT$ {product.salePrice}</span>
            <span className="pd-price-origin">NT$ {product.price}</span>
            <span className="pd-price-badge">
              省 NT$ {product.price - product.salePrice}
            </span>
          </div>

          <div className="pd-qty-row">
            <span>數量</span>
            <div className="pd-qty-stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="減少數量">
                −
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="增加數量">
                +
              </button>
            </div>
          </div>

          <div className="pd-subtotal-row">
            <span className="pd-subtotal-label">小計</span>
            <span className="pd-subtotal-amount">NT$ {subtotal}</span>
            {savings > 0 && <span className="pd-subtotal-savings">已省 NT$ {savings}</span>}
          </div>

          <button className="btn btn-primary btn-block pd-add-btn" onClick={handleAdd}>
            {justAdded ? "已加入購物車 ✓" : "加入購物車"}
          </button>

          {product.ingredients && (
            <div className="pd-meta-box">
              <h3>成分說明</h3>
              <p>{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>

      <div className="pd-sections">
        <section className="pd-section">
          <h2>產品介紹</h2>
          <p className="pd-description">{product.description}</p>
        </section>

        {product.usage.length > 0 && (
          <section className="pd-section">
            <h2>使用方法</h2>
            <ul className="pd-usage-list">
              {product.usage.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
