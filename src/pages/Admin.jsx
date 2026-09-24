import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOrders, updateOrderStatus } from "../api/orders";
import { fetchProducts, updateProduct } from "../api/products";
import { fetchWishlist } from "../api/feedback";
import { CATEGORIES } from "../data/mockProducts";
import "./Admin.css";

export default function Admin() {
  const [tab, setTab] = useState("orders");

  return (
    <div className="admin">
      <header className="admin-header">
        <div className="container admin-header-inner">
          <Link to="/" className="admin-logo">
            媽媽沙發 X 淨毒五郎．後台管理
          </Link>
          <Link to="/" className="admin-back-link">
            回到前台
          </Link>
        </div>
      </header>

      <div className="container admin-body">
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${tab === "orders" ? "is-active" : ""}`}
            onClick={() => setTab("orders")}
          >
            訂單總覽
          </button>
          <button
            className={`admin-tab-btn ${tab === "products" ? "is-active" : ""}`}
            onClick={() => setTab("products")}
          >
            商品管理
          </button>
          <button
            className={`admin-tab-btn ${tab === "wishlist" ? "is-active" : ""}`}
            onClick={() => setTab("wishlist")}
          >
            許願清單
          </button>
        </div>

        {tab === "orders" && <OrdersPanel />}
        {tab === "products" && <ProductsPanel />}
        {tab === "wishlist" && <WishlistPanel />}
      </div>
    </div>
  );
}

function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => {
    fetchOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  async function handleToggleStatus(order) {
    const newStatus = order.status === "待付款" ? "已付款" : "待付款";

    setPendingId(order.id);
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      );
    } finally {
      setPendingId(null);
    }
  }

  const paidCount = orders.filter((o) => o.status === "已付款").length;
  const pendingCount = orders.length - paidCount;
  const totalRevenue = orders
    .filter((o) => o.status === "已付款")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <h1 className="admin-title">訂單總覽</h1>

      <div className="admin-stats">
        <StatCard label="訂單總數" value={orders.length} />
        <StatCard label="待付款" value={pendingCount} tone="clay" />
        <StatCard label="已付款" value={paidCount} tone="herb" />
        <StatCard label="已付款總額" value={`NT$ ${totalRevenue}`} />
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <p className="admin-loading">載入訂單中…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>買家</th>
                <th>聯絡方式</th>
                <th>商品明細</th>
                <th>總金額</th>
                <th>匯款後五碼</th>
                <th>成立時間</th>
                <th>狀態</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="mono">{o.id}</td>
                  <td>{o.buyerName}</td>
                  <td>
                    <div className="admin-contact">
                      <span>{o.phone}</span>
                      <span className="admin-contact-email">{o.email}</span>
                    </div>
                  </td>
                  <td>
                    <ul className="admin-items">
                      {o.items.map((it) => (
                        <li key={it.id}>
                          {it.name} × {it.qty}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="mono">NT$ {o.total}</td>
                  <td className="mono">{o.remitLast5 || "—"}</td>
                  <td className="admin-time">{o.createdAt}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        o.status === "已付款" ? "status-paid" : "status-pending"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline admin-toggle-btn"
                      onClick={() => handleToggleStatus(o)}
                      disabled={pendingId === o.id}
                    >
                      {pendingId === o.id
                        ? "更新中…"
                        : o.status === "待付款"
                        ? "標記已付款"
                        : "標記待付款"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function ProductsPanel() {
  const [products, setProducts] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    fetchProducts({ includeUnpublished: true }).then((data) => {
      setProducts(data);
      const nextDrafts = {};
      data.forEach((p) => {
        nextDrafts[p.id] = {
          price: p.price,
          salePrice: p.salePrice,
          category: p.category,
          published: p.published,
        };
      });
      setDrafts(nextDrafts);
      setLoading(false);
    });
  }

  function updateDraft(id, field, value) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  function isDirty(product) {
    const d = drafts[product.id];
    if (!d) return false;
    return (
      Number(d.price) !== product.price ||
      Number(d.salePrice) !== product.salePrice ||
      d.category !== product.category ||
      d.published !== product.published
    );
  }

  async function handleSave(product) {
    const d = drafts[product.id];
    setSavingId(product.id);
    try {
      const updated = await updateProduct(product.id, {
        price: Number(d.price),
        salePrice: Number(d.salePrice),
        category: d.category,
        published: d.published,
      });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      setSavedId(product.id);
      setTimeout(() => setSavedId(null), 1500);
    } finally {
      setSavingId(null);
    }
  }

  function handleTogglePublished(product) {
    updateDraft(product.id, "published", !drafts[product.id]?.published);
  }

  const filtered = keyword.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(keyword.trim().toLowerCase()))
    : products;

  const publishedCount = products.filter((p) => p.published).length;

  return (
    <>
      <h1 className="admin-title">商品管理</h1>

      <div className="admin-stats">
        <StatCard label="商品總數" value={products.length} />
        <StatCard label="上架中" value={publishedCount} tone="herb" />
        <StatCard label="已下架" value={products.length - publishedCount} tone="clay" />
      </div>

      <div className="admin-product-search">
        <input
          type="search"
          placeholder="搜尋商品名稱"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="搜尋商品"
        />
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <p className="admin-loading">載入商品中…</p>
        ) : (
          <table className="admin-table admin-product-table">
            <thead>
              <tr>
                <th>商品</th>
                <th>分類</th>
                <th>原價</th>
                <th>售價</th>
                <th>狀態</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const d = drafts[p.id] || {};
                const dirty = isDirty(p);
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-product-cell">
                        <img src={p.thumbnail} alt="" className="admin-product-thumb" />
                        <span className="admin-product-name">{p.name}</span>
                      </div>
                    </td>
                    <td>
                      <select
                        className="admin-input"
                        value={d.category}
                        onChange={(e) => updateDraft(p.id, "category", e.target.value)}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="admin-input admin-input-number"
                        type="number"
                        min="0"
                        value={d.price ?? ""}
                        onChange={(e) => updateDraft(p.id, "price", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="admin-input admin-input-number"
                        type="number"
                        min="0"
                        value={d.salePrice ?? ""}
                        onChange={(e) => updateDraft(p.id, "salePrice", e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`status-badge status-toggle ${
                          d.published ? "status-paid" : "status-pending"
                        }`}
                        onClick={() => handleTogglePublished(p)}
                      >
                        {d.published ? "上架中" : "已下架"}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary admin-toggle-btn"
                        onClick={() => handleSave(p)}
                        disabled={!dirty || savingId === p.id}
                      >
                        {savingId === p.id ? "儲存中…" : savedId === p.id ? "已儲存 ✓" : "儲存"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function WishlistPanel() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <h1 className="admin-title">許願清單</h1>

      <div className="admin-stats">
        <StatCard label="顧客留言總數" value={entries.length} />
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <p className="admin-loading">載入許願清單中…</p>
        ) : entries.length === 0 ? (
          <p className="admin-loading">目前還沒有顧客留下許願清單</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>訂單編號</th>
                <th>想團購的品牌／商品</th>
                <th>其他留言</th>
                <th>留言時間</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((w) => (
                <tr key={w.id}>
                  <td className="mono">{w.orderId}</td>
                  <td>{w.wishlist || "—"}</td>
                  <td>{w.otherMessage || "—"}</td>
                  <td className="admin-time">{w.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className={`stat-card ${tone ? `stat-${tone}` : ""}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}
