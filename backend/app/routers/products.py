from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/products", tags=["products"])


def to_product_out(p: models.Product) -> dict:
    return {
        "id": p.id,
        "name": p.name,
        "category": p.category,
        "price": p.price,
        "salePrice": p.sale_price,
        "thumbnail": p.thumbnail,
        "gallery": p.gallery or [],
        "shortDesc": p.short_desc or "",
        "description": p.description or "",
        "usage": p.usage or [],
        "ingredients": p.ingredients or "",
        "published": p.published,
    }


@router.get("", response_model=list[schemas.ProductOut])
def list_products(
    keyword: str = "",
    category: str = "",
    sort: str = "",
    includeUnpublished: bool = False,
    db: Session = Depends(get_db),
):
    query = db.query(models.Product)

    if not includeUnpublished:
        query = query.filter(models.Product.published.is_(True))

    if keyword.strip():
        kw = f"%{keyword.strip()}%"
        query = query.filter(models.Product.name.ilike(kw))

    if category:
        query = query.filter(models.Product.category == category)

    if sort == "price-asc":
        query = query.order_by(models.Product.sale_price.asc())
    elif sort == "price-desc":
        query = query.order_by(models.Product.sale_price.desc())

    products = query.all()
    return [to_product_out(p) for p in products]


@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="找不到這項商品")
    return to_product_out(product)


@router.patch("/{product_id}", response_model=schemas.ProductOut)
def update_product(product_id: str, changes: schemas.ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="找不到這項商品")

    if changes.price is not None:
        product.price = changes.price
    if changes.salePrice is not None:
        product.sale_price = changes.salePrice
    if changes.category is not None:
        product.category = changes.category
    if changes.published is not None:
        product.published = changes.published

    db.commit()
    db.refresh(product)
    return to_product_out(product)
