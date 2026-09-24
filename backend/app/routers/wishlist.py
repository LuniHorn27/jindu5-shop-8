from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])


def to_wishlist_out(w: models.Wishlist) -> dict:
    return {
        "id": w.id,
        "orderId": w.order_id,
        "wishlist": w.wishlist or "",
        "otherMessage": w.other_message or "",
        "createdAt": w.created_at.strftime("%Y-%m-%d %H:%M"),
    }


@router.post("", response_model=schemas.WishlistOut)
def submit_wishlist(payload: schemas.WishlistCreate, db: Session = Depends(get_db)):
    entry = models.Wishlist(
        order_id=payload.orderId,
        wishlist=payload.wishlist,
        other_message=payload.otherMessage,
        created_at=datetime.now(),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return to_wishlist_out(entry)


@router.get("", response_model=list[schemas.WishlistOut])
def list_wishlist(db: Session = Depends(get_db)):
    entries = db.query(models.Wishlist).order_by(models.Wishlist.created_at.desc()).all()
    return [to_wishlist_out(e) for e in entries]
