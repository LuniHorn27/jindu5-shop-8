import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/orders", tags=["orders"])


def to_order_out(o: models.Order) -> dict:
    return {
        "id": o.id,
        "buyerName": o.buyer_name,
        "phone": o.phone,
        "email": o.email,
        "items": [
            {"id": it.product_id, "name": it.name, "qty": it.qty, "price": it.price}
            for it in o.items
        ],
        "total": o.total,
        "totalSavings": o.total_savings,
        "status": o.status,
        "remitLast5": o.remit_last5 or "",
        "createdAt": o.created_at.strftime("%Y-%m-%d %H:%M"),
    }


def generate_order_id() -> str:
    now = datetime.now()
    rand = random.randint(100, 999)
    return f"JD{now.strftime('%Y%m%d')}{rand}"


@router.post("", response_model=schemas.OrderOut)
def create_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    order_id = generate_order_id()
    order = models.Order(
        id=order_id,
        buyer_name=payload.buyerName,
        phone=payload.phone,
        email=payload.email,
        total=payload.total,
        total_savings=payload.totalSavings,
        status="待付款",
        remit_last5="",
        created_at=datetime.now(),
    )
    for it in payload.items:
        order.items.append(
            models.OrderItem(product_id=it.id, name=it.name, qty=it.qty, price=it.price)
        )

    db.add(order)
    db.commit()
    db.refresh(order)
    return to_order_out(order)


@router.get("", response_model=list[schemas.OrderOut])
def list_orders(db: Session = Depends(get_db)):
    orders = (
        db.query(models.Order)
        .options(joinedload(models.Order.items))
        .order_by(models.Order.created_at.desc())
        .all()
    )
    return [to_order_out(o) for o in orders]


@router.get("/{order_id}", response_model=schemas.OrderOut)
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).options(joinedload(models.Order.items)).filter(
        models.Order.id == order_id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="找不到這筆訂單")
    return to_order_out(order)


@router.patch("/{order_id}/status", response_model=schemas.OrderOut)
def update_order_status(order_id: str, payload: schemas.OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.query(models.Order).options(joinedload(models.Order.items)).filter(
        models.Order.id == order_id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="找不到這筆訂單")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return to_order_out(order)


@router.post("/{order_id}/remittance", response_model=schemas.OrderOut)
def report_remittance(order_id: str, payload: schemas.RemittanceUpdate, db: Session = Depends(get_db)):
    order = db.query(models.Order).options(joinedload(models.Order.items)).filter(
        models.Order.id == order_id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="找不到這筆訂單")
    order.remit_last5 = payload.last5
    db.commit()
    db.refresh(order)
    return to_order_out(order)
