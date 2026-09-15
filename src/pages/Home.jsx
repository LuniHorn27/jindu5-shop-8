import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api/products";
import { CATEGORIES } from "../data/mockProducts";
import ProductCard from "../components/ProductCard.jsx";
import "./Home.css";

const PAGE_SIZE_OPTIONS = [10, 24, 48, 72];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const keyword = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const pageSize = Number(searchParams.get("per")) || PAGE_SIZE_OPTIONS[0];

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchProducts({ keyword, category, sort }).then((data) => {
      if (alive) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [keyword, category, sort]);

  // 篩選條件或每頁筆數變動時，回到第一頁
  useEffect(() => {
    setPage(1);
  }, [keyword, category, sort, pageSize]);

  function updateParams(next) {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    setSearchParams(params);
  }

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage, pageSize]);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="hero-eyebrow">安心居家．溫和防護</p>
          <h1 className="hero-title">
            把「淨毒五郎」的安心
            <br />
            帶回你的家
          </h1>
          <p className="hero-desc">
            集結居家清潔、個人防護與衣物清潔的日常好物，天然弱酸性配方，
            讓每一次噴灑都是對家人的溫柔照顧。
          </p>
        </div>
      </section>

      <section className="container product-section">
        <div className="product-section-head">
          <h2 className="section-title">
            {keyword ? `搜尋「${keyword}」的結果` : "本期團購商品"}
          </h2>
          <span className="product-count">
            {loading ? "載入中…" : `共 ${products.length} 項商品`}
          </span>
        </div>

        <div className="product-toolbar">
          <form
            className="toolbar-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              updateParams({ q: e.target.elements.q.value });
            }}
          >
            <input
              type="search"
              name="q"
              defaultValue={keyword}
              placeholder="搜尋商品，例如：抑菌噴霧"
              aria-label="搜尋商品"
            />
            <button type="submit" aria-label="搜尋">
              搜尋
            </button>
          </form>

          <div className="toolbar-controls">
            <select
              className="pill-select"
              value={category}
              onChange={(e) => updateParams({ category: e.target.value })}
              aria-label="分類篩選"
            >
              <option value="">全部分類</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              className="pill-select"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              aria-label="排序方式"
            >
              <option value="">預設排序</option>
              <option value="price-asc">價格由低到高</option>
              <option value="price-desc">價格由高到低</option>
            </select>

            <label className="toolbar-pagesize">
              <span>每頁顯示</span>
              <select
                className="pill-select"
                value={pageSize}
                onChange={(e) => updateParams({ per: e.target.value })}
                aria-label="每頁顯示商品數"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} 個
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="product-skeleton" key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="product-empty">
            <p>找不到符合條件的商品，換個關鍵字或分類試試看吧。</p>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {pagedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="分頁">
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  上一頁
                </button>
                <span className="pagination-status">
                  第 {currentPage} / {totalPages} 頁
                </span>
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一頁
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </>
  );
}
