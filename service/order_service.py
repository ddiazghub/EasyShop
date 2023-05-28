from helpers import group_by
from model.error import NOT_FOUND, INSUFFICIENT_STOCK
from model.order import Order, OrderCreation, OrderState, OrderWithProducts, ProductOrderWithProduct, StateUpdate
from psycopg import Cursor
from psycopg.errors import CheckViolation
from db import database
from typing import Sequence

order_id: int

def get_where(cursor: Cursor, where_clause: str, params: Sequence) -> list[OrderWithProducts]:
    where_clause = f"WHERE {where_clause}" if where_clause else ""

    query = f"""
        SELECT p.*, po.amount, po.order_id
        FROM "Order" AS o
        JOIN "ProductOrder" AS po ON po.order_id = o.order_id
        JOIN "Product" AS p ON p.product_id = po.product_id
        {where_clause}
    """
    order_products: dict[int, list[ProductOrderWithProduct]] = group_by(
        cursor.execute(query, params),
        lambda record: record[-1],
        lambda record: ProductOrderWithProduct.parse(record)
    )
    
    query = f"""
        SELECT *
        FROM "Order" AS o
        {where_clause}
    """

    return [OrderWithProducts.parse(record, order_products[record[0]]) for record in cursor.execute(query, params)]

def get_all() -> list[Order]:
    def order_get(cursor: Cursor) -> list[Order]:
        return [Order.parse(record) for record in cursor.execute("SELECT * FROM \"Order\"")]
    
    return database.transaction(order_get)

def get_by_id(order_id: int) -> Order:
    def order_get(cursor: Cursor) -> Order:
        record = cursor.execute("SELECT * FROM \"Order\" WHERE order_id = %s", [order_id]).fetchone()

        if not record:
            raise NOT_FOUND
        
        return Order.parse(record)
    
    return database.transaction(order_get)

def get_by_client(client_id: int) -> list[OrderWithProducts]:
    def order_get(cursor: Cursor) -> list[OrderWithProducts]:
        return get_where(cursor, "o.client_id = %s", [client_id])

    return database.transaction(order_get)

def get_by_supplier(supplier_id: int) -> list[OrderWithProducts]:
    def order_get(cursor: Cursor) -> list[OrderWithProducts]:
        return get_where(cursor, "o.supplier_id = %s", [supplier_id])
    
    return database.transaction(order_get)

def get_by_client_and_supplier(client_id: int, supplier_id: int) -> list[OrderWithProducts]:
    def order_get(cursor: Cursor) -> list[OrderWithProducts]:
        return get_where(cursor, "o.client_id = %s AND o.supplier_id = %s", [client_id, supplier_id])

    return database.transaction(order_get)

def create(order: OrderCreation) -> Order:
    global order_id

    def order_create(cursor: Cursor) -> Order:
        query = """
        INSERT INTO \"Order\" (client_id, supplier_id, order_notes)
        VALUES (%s, %s, %s)
        RETURNING order_id
        """

        global order_id
        order_id = cursor.execute(query, (order.client_id, order.supplier_id, order.order_notes)).fetchone()[0]
        
        query = """
        INSERT INTO \"ProductOrder\" (product_id, order_id, amount)
        VALUES (%s, %s, %s)
        """

        cursor.executemany(query, [(product.product_id, order_id, product.amount) for product in order.products])

        query = """
        UPDATE "Order"
        SET total_cost = (
            SELECT SUM(p.unit_price * o.amount)
            FROM "ProductOrder" AS o
            JOIN "Product" AS p ON p.product_id = o.product_id
            WHERE order_id = %s
        )
        WHERE order_id = %s
        """

        cursor.execute(query, (order_id, order_id))

        query = """
        UPDATE "Product"
        SET stock = stock - %s,
        total_purchases = total_purchases + %s
        WHERE product_id = %s
        """
        
        try:
            cursor.executemany(query, [(product.amount, product.amount, product.product_id) for product in order.products])
        except CheckViolation:
            raise INSUFFICIENT_STOCK
    
    database.transaction(order_create)

    return get_by_id(order_id)

def modify_state(order_id: int, new_state: OrderState) -> Order:
    def order_state(cursor: Cursor) -> Order:
        query = """
        UPDATE "Order"
        SET state_id = %s
        WHERE order_id = %s
        RETURNING order_id, client_id, supplier_id, total_cost, order_notes, purchase_date, delivery_date, state_id
        """

        modified_order = cursor.execute(query, (int(new_state), order_id)).fetchone()
        
        if not modified_order:
            raise NOT_FOUND
        
        return Order.parse(modified_order)
    
    return database.transaction(order_state)