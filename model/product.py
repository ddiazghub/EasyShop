from __future__ import annotations
from pydantic import BaseModel
from enum import IntEnum

class Category(IntEnum):
    Electronics = 1

class ProductCreation(BaseModel):
    name: str
    description: str | None = None
    image_url: str | None = None
    unit_price: float
    supplier_id: int
    category: Category

class ProductModification(BaseModel):
    product_id: int
    name: str
    description: str | None = None
    image_url: str | None = None
    unit_price: float
    category: Category

class Product(BaseModel):
    product_id: int | None = None
    name: str
    description: str | None = None
    image_url: str | None = None
    stock: int
    unit_price: float
    total_purchases: int
    supplier_id: int
    category: Category

    @staticmethod
    def parse(result: tuple) -> Product:
        return Product(
            product_id=result[0],
            name=result[1],
            description=result[2],
            image_url=result[3],
            stock=result[4],
            total_purchases=result[5],
            unit_price=result[6],
            supplier_id=result[7],
            category=Category(result[8])
        )
    
class StockModification(BaseModel):
    product_id: int
    stock: int