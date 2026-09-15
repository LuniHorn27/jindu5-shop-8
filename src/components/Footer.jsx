import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-title">媽媽沙發 X 淨毒五郎</h3>
          <p className="footer-text">
            以天然、溫和為核心的居家清潔與防護用品，陪伴每個家庭安心生活。
          </p>
        </div>

        <div id="policy">
          <h4 className="footer-heading">退換貨政策</h4>
          <p className="footer-text">
            商品若有瑕疵或運送損壞，請於收到商品後 7 日內與我們聯繫，
            我們將協助辦理退換貨。因團購商品為集中出貨，恕不接受個人喜好因素之退換。
          </p>
        </div>

        <div id="contact">
          <h4 className="footer-heading">聯絡客服</h4>
          <p className="footer-text">客服時間：週一至週五 10:00–18:00</p>
          <p className="footer-text">Line 客服：@jindu5-group</p>
          <p className="footer-text">Email：service@jindu5-group.example</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© 2026 媽媽沙發 X 淨毒五郎．All rights reserved.</div>
      </div>
    </footer>
  );
}
