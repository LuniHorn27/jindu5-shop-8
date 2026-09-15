import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "首頁", to: "/" },
  { label: "退換貨政策", href: "#policy" },
  { label: "聯絡客服", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalCount, openDrawer } = useCart();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <SofaMark />
          <span className="navbar-logo-text">
            媽媽沙發<span className="navbar-logo-x">×</span>淨毒五郎
            <span className="navbar-logo-sub">團購小舖</span>
          </span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? "is-open" : ""}`} aria-label="主選單">
          {NAV_LINKS.map((link) =>
            link.to ? (
              <Link key={link.label} to={link.to} onClick={closeMenu}>
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="navbar-actions">
          <button className="navbar-cart-btn" onClick={openDrawer} aria-label="開啟購物車">
            <CartIcon />
            {totalCount > 0 && <span className="navbar-cart-badge">{totalCount}</span>}
          </button>

          <button
            className="navbar-burger"
            aria-label={menuOpen ? "關閉選單" : "開啟選單"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

function SofaMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" className="navbar-logo-mark">
      <path
        d="M7 14v-2.5A2.5 2.5 0 0 1 9.5 9h11A2.5 2.5 0 0 1 23 11.5V14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 14.5A1.5 1.5 0 0 1 7 13h16a1.5 1.5 0 0 1 1.5 1.5V18a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1v-3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M6.5 19v2M23.5 19v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4h2l2.4 11.4A2 2 0 0 0 9.35 17h7.3a2 2 0 0 0 1.95-1.6L20 8H6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20.5" r="1.4" fill="currentColor" />
      <circle cx="17" cy="20.5" r="1.4" fill="currentColor" />
    </svg>
  );
}
