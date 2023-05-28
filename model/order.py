from __future__ import annotations
from pydantic import BaseModel
from datetime import date, datetime
from enum import IntEnum

from model.product import Product

class OrderState(IntEnum):
    Confirmed = 1,
    Dispatched = 2,
    Delivered = 3,
    Canceled = 4;

class StateUpdate(BaseModel):
    order_id: int
    original_state: OrderState
    new_state: OrderState
    updated_at: datetime

    @staticmethod
    def parse(result: tuple) -> StateUpdate:
        return StateUpdate(
            order_id=result[0],
            original_state=OrderState(result[1]),
            new_state=OrderState(result[2]),
            updated_at=result[3]
        )

class ProductOrder(BaseModel):
    product_id: int
    amount: int

class ProductOrderWithProduct(BaseModel):
    product: Product
    amount: int

    @staticmethod
    def parse(result: tuple) -> ProductOrderWithProduct:
        return ProductOrderWithProduct(
            product=Product.parse(result),
            amount=result[-2]
        )

class OrderCreation(BaseModel):
    client_id: int
    supplier_id: int
    products: list[ProductOrder]
    order_notes: str

class StateModification(BaseModel):
    order_id: int
    new_state: OrderState

class Order(BaseModel):
    order_id: int | None = None
    client_id: int
    supplier_id: int
    total_cost: float
    order_notes: str
    purchase_date: date
    delivery_date: date
    state: OrderState
    
    @staticmethod
    def parse(result: tuple) -> Order:
        return Order(
            order_id=result[0],
            client_id=result[1],
            supplier_id=result[2],
            total_cost=result[3],
            order_notes=result[4],
            purchase_date=result[5],
            delivery_date=result[6],
            state=OrderState(result[7])
        )
    
class OrderWithProducts(Order):
    products: list[ProductOrderWithProduct]

    @staticmethod
    def parse(result: tuple, products: list[ProductOrderWithProduct]) -> OrderWithProducts:
        return OrderWithProducts(
            order_id=result[0],
            client_id=result[1],
            supplier_id=result[2],
            total_cost=result[3],
            order_notes=result[4],
            purchase_date=result[5],
            delivery_date=result[6],
            state=OrderState(result[7]),
            products=products
        )