"""
一次性匯入腳本：把 seed_data/products.json、seed_data/orders.json
匯入 MySQL 資料庫。重複執行不會造成重複資料（會先清空重建）。
用法：python3 seed.py
"""
import json
from datetime import datetime
from pathlib import Path

from app.database import Base, engine, SessionLocal
from app import models

SEED_DIR = Path(__file__).parent / "seed_data"


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        db.query(models.OrderItem).delete()
        db.query(models.Order).delete()
        db.query(models.Product).delete()
        db.commit()

        products = json.loads((SEED_DIR / "products.json").read_text(encoding="utf-8"))
        for p in products:
            db.add(
                models.Product(
                    id=p["id"],
                    name=p["name"],
                    category=p["category"],
                    price=p["price"],
                    sale_price=p["salePrice"],
                    thumbnail=p["thumbnail"],
                    gallery=p["gallery"],
                    short_desc=p["shortDesc"],
                    description=p["description"],
                    usage=p["usage"],
                    ingredients=p["ingredients"],
                    published=p.get("published", True),
                )
            )
        db.commit()
        print(f"匯入 {len(products)} 筆商品完成")

        orders = json.loads((SEED_DIR / "orders.json").read_text(encoding="utf-8"))
        for o in orders:
            order = models.Order(
                id=o["id"],
                buyer_name=o["buyerName"],
                phone=o["phone"],
                email=o["email"],
                total=o["total"],
                total_savings=o.get("totalSavings", 0),
                status=o["status"],
                remit_last5=o.get("remitLast5", ""),
                created_at=datetime.strptime(o["createdAt"], "%Y-%m-%d %H:%M"),
            )
            for it in o["items"]:
                order.items.append(
                    models.OrderItem(
                        product_id=it["id"], name=it["name"], qty=it["qty"], price=it["price"]
                    )
                )
            db.add(order)
        db.commit()
        print(f"匯入 {len(orders)} 筆訂單完成")

    finally:
        db.close()


if __name__ == "__main__":
    main()
