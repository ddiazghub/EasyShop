from typing import Annotated
from fastapi import APIRouter, Header
from service import order_service
from model.order import Order, OrderCreation, StateModification
from service import user_service

router = APIRouter(
    prefix="/order",
    tags=["orders"],
    responses={
        404: {"description": "Error: Order not found"},
        204: {"description": "Operation completed successfully"}
    }
)

@router.get("")
async def get_all_orders() -> list[Order]:
    return order_service.get_all()

@router.get("/{order_id}")
async def get_by_id(order_id: int) -> Order:
    return order_service.get_by_id(order_id)

@router.get("/supplier/{supplier_id}")
async def get_by_supplier_id(supplier_id: int) -> list[Order]:
    return order_service.get_by_supplier(supplier_id)

@router.get("/client/{client_id}")
async def get_by_client_id(client_id: int) -> list[Order]:
    return order_service.get_by_client(client_id)

@router.post("")
async def create_order(order: OrderCreation, authorization: Annotated[str, Header()]) -> Order:
    user_service.authorize(authorization)

    return order_service.create(order)

@router.put("")
async def modify_order_state(modification: StateModification) -> Order:
    return order_service.modify_state(modification.order_id, modification.new_state)