from __future__ import annotations
from pydantic import BaseModel
from enum import IntEnum, StrEnum
from datetime import datetime

class Category(IntEnum):
    Vehicle = 1
    Clothing = 2
    Accessories = 3
    Sports = 4
    Home = 5
    Garden = 6
    Toys = 7
    Business = 8
    Industrial = 9
    Health = 10
    Pets = 11
    Electronics = 12
    School = 13
    Art = 14

class SortBy(StrEnum):
    Popularity = "popularity"
    Stock = "stock"
    Price = "price"
    Latest = "latest"

    def to_field(self) -> str:
        match self:
            case SortBy.Popularity:
                return "total_purchases"
            case SortBy.Stock:
                return "stock"
            case SortBy.Price:
                return "unit_price"
            case SortBy.Latest:
                return "created_at"

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
    created_at: datetime

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
            category=Category(result[8]),
            created_at=result[9]
        )
    
class StockModification(BaseModel):
    product_id: int
    stock: int