from sqlalchemy import Column, String, Integer, Boolean, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String(20), primary_key=True)
    name = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)
    price = Column(Integer, nullable=False)
    sale_price = Column(Integer, nullable=False)
    thumbnail = Column(Text, nullable=False)
    gallery = Column(JSON, nullable=False, default=list)
    short_desc = Column(Text, default="")
    description = Column(Text, default="")
    usage = Column(JSON, nullable=False, default=list)
    ingredients = Column(Text, default="")
    published = Column(Boolean, nullable=False, default=True)


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(30), primary_key=True)
    buyer_name = Column(String(100), nullable=False)
    phone = Column(String(30), nullable=False)
    email = Column(String(150), nullable=False)
    total = Column(Integer, nullable=False)
    total_savings = Column(Integer, default=0)
    status = Column(String(20), nullable=False, default="待付款")
    remit_last5 = Column(String(10), default="")
    created_at = Column(DateTime, nullable=False)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String(30), ForeignKey("orders.id"), nullable=False)
    product_id = Column(String(20), nullable=False)
    name = Column(String(255), nullable=False)
    qty = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String(30), nullable=False)
    wishlist = Column(Text, default="")
    other_message = Column(Text, default="")
    created_at = Column(DateTime, nullable=False)
