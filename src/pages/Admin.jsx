import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchOrders, updateOrderStatus } from "../api/orders";
import "./Admin.css";

export default function Admin() {
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
    const payload = { orderId: order.id, status: newStatus };

    // TODO: Call API here
    console.log("[Admin] updateOrderStatus payload:", payload);

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
      </div>
    </div>
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
