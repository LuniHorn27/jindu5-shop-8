import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
  return (
    <div className="container about">
      <div className="about-hero">
        <h1>關於我們</h1>
        <p>
          媽媽沙發 × 淨毒五郎，是一群媽媽們發起的團購小舖，
          希望把自己用過、真心推薦的好物，用更划算的價格分享給大家。
        </p>
      </div>

      <div className="about-card">
        <h2>我們的理念</h2>
        <p>
          每一件上架的商品，都是團隊實際試用、確認品質與安全性之後才推薦給大家的。
          我們相信好的東西值得被分享，也相信團購的力量能讓大家用更親民的價格入手。
        </p>
      </div>

      <div className="about-card">
        <h2>為什麼選擇我們</h2>
        <ul className="about-list">
          <li>嚴選商品，實際使用後才上架推薦</li>
          <li>團購優惠價，省下更多預算</li>
          <li>下單後提供完整的匯款與出貨說明</li>
          <li>用心回覆每一位顧客的訊息與需求</li>
        </ul>
      </div>

      <div className="about-back">
        <Link to="/" className="btn btn-outline">
          回到首頁
        </Link>
      </div>
    </div>
  );
}
