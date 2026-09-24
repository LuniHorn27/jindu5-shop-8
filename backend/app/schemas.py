from typing import List, Optional
from pydantic import BaseModel


class ProductOut(BaseModel):
    id: str
    name: str
    category: str
    price: int
    salePrice: int
    thumbnail: str
    gallery: List[str]
    shortDesc: str
    description: str
    usage: List[str]
    ingredients: str
    published: bool

    class Config:
        from_attributes = True


class ProductUpdate(BaseModel):
    price: Optional[int] = None
    salePrice: Optional[int] = None
    category: Optional[str] = None
    published: Optional[bool] = None


class OrderItemIn(BaseModel):
    id: str
    name: str
    qty: int
    price: int


class OrderCreate(BaseModel):
    buyerName: str
    phone: str
    email: str
    items: List[OrderItemIn]
    total: int
    totalSavings: int = 0


class OrderItemOut(BaseModel):
    id: str
    name: str
    qty: int
    price: int

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: str
    buyerName: str
    phone: str
    email: str
    items: List[OrderItemOut]
    total: int
    totalSavings: int
    status: str
    remitLast5: str
    createdAt: str

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: str


class RemittanceUpdate(BaseModel):
    last5: str


class WishlistCreate(BaseModel):
    orderId: str
    wishlist: str = ""
    otherMessage: str = ""


class WishlistOut(BaseModel):
    id: int
    orderId: str
    wishlist: str
    otherMessage: str
    createdAt: str

    class Config:
        from_attributes = True
