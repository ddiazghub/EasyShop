from model.order import Order, OrderCreation, OrderState, StateUpdate
from psycopg import Cursor
from db import database
from typing import Sequence

order_id: int

def get_where(cursor: Cursor, where_clause: str, params: Sequence) -> list[Order]:
    records: dict[int, tuple] = {record[0]: record for record in cursor.execute(f"SELECT * FROM \"Order\" WHERE {where_clause}", params)}
    order_ids: list[int] = [order_id for order_id in records.keys()]
    placeholder = ", ".join("%s" for _ in order_ids)
    updates = (StateUpdate.parse(record) for record in cursor.execute(f"SELECT * FROM \"OrderStateUpdate\" WHERE order_id IN ({placeholder})", order_ids))

    return [Order.parse(records[update.order_id], update) for update in updates]

def get_all() -> list[Order]:
    def order_get(cursor: Cursor) -> list[Order]:
        return [Order.parse(record) for record in cursor.execute("SELECT * FROM \"Order\"")]
    
    return database.transaction(order_get)

def get_by_id(order_id: int) -> Order:
    def order_get(cursor: Cursor) -> Order:
        record = cursor.execute("SELECT * FROM \"Order\" WHERE order_id = %s", [order_id]).fetchone()

        return Order.parse(record)
    
    return database.transaction(order_get)

def get_by_client(client_id: int) -> list[Order]:
    def order_get(cursor: Cursor) -> list[Order]:
        return [Order.parse(record) for record in cursor.execute("SELECT * FROM \"Order\" WHERE client_id = %s", [client_id])]

    return database.transaction(order_get)

def get_by_supplier(supplier_id: int) -> list[Order]:
    def order_get(cursor: Cursor) -> list[Order]:
        return [Order.parse(record) for record in cursor.execute("SELECT * FROM \"Order\" WHERE supplier_id = %s", [supplier_id])]

    return database.transaction(order_get)

def create(order: OrderCreation) -> Order:
    global order_id

    def order_create(cursor: Cursor) -> Order:
        query = """
        INSERT INTO \"Order\" (client_id, supplier_id)
        VALUES (%s, %s)
        RETURNING order_id
        """

        global order_id
        order_id = cursor.execute(query, (order.client_id, order.supplier_id)).fetchone()[0]
        print(order_id)
        query = """
        INSERT INTO \"ProductOrder\" (product_id, order_id, amount)
        VALUES (%s, %s, %s)
        """

        cursor.executemany(query, [(product.product_id, order_id, product.amount) for product in order.products])

        query = """
        UPDATE "Order"
        SET total_cost = (
            SELECT p.unit_price * o.amount
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
        
        cursor.executemany(query, [(product.amount, product.amount, product.product_id) for product in order.products])
    
    database.transaction(order_create)

    return get_by_id(order_id)


def modify_state(order_id: int, new_state: OrderState) -> Order:
    def order_state(cursor: Cursor) -> Order:
        query = """
        UPDATE "Order"
        SET state_id = %s
        WHERE order_id = %s
        RETURNING order_id, client_id, supplier_id, total_cost, purchase_date, delivery_date, state_id
        """

        modified_order = cursor.execute(query, (int(new_state), order_id)).fetchone()
        
        return Order.parse(modified_order)
    
    return database.transaction(order_state)