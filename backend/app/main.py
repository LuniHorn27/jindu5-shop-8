import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import Base, engine
from . import models
from .routers import products, orders, wishlist

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="淨毒五郎 團購小舖 API")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(wishlist.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
