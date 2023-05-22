from pydantic import BaseModel
from datetime import date, datetime
from enum import IntEnum

class OrderState(IntEnum):
    Confirmed = 1,
    Dispatched = 2,
    Delivered = 3,
    Canceled = 4;

class OrderStateUpdate(BaseModel):
    order_id: int
    original_state: OrderState
    new_state: OrderState
    updated_at: datetime

class ProductOrder(BaseModel):
    product_id: int
    amount: int

class OrderCreation(BaseModel):
    client_id: int
    supplier_id: int
    products: list[ProductOrder]

class Order(BaseModel):
    order_id: int | None
    client_id: int
    supplier_id: int
    total_cost: float
    purchase_date: date
    delivery_date: date
    state: OrderState
    updates: list[OrderStateUpdate]