from model.error import NEGATIVE_STOCK, NOT_FOUND, NEGATIVE_PRICE
from model.product import Category, ProductCreation, Product, ProductModification, ProductWithSupplier, SortBy
from psycopg import Cursor
from psycopg.errors import CheckViolation
from db import database

def get_where(where_clause: str | None = None, params: tuple | list = [], sort_by: SortBy | None = None, limit: int | None = None, search: str = "") -> list[Product]:
    def product_get(cursor: Cursor) -> list[Product]:
        where = f"WHERE {where_clause}" if where_clause else ""
        order_by = f"ORDER BY {sort_by.to_field()} DESC" if sort_by else ""
        lim = f"LIMIT {limit}" if limit else ""
        par = [*params]

        if search != "":
            where_search = "LOWER(product_name) LIKE LOWER(%s) OR LOWER(description) LIKE LOWER(%s)"
            s = f"%{search}%"
            par.extend((s, s))

            if where == "":
                where = f"WHERE {where_search}"
            else:
                where += f"AND {where_search}"
        
        query = f"SELECT * FROM \"Product\" {where} {order_by} {lim}"
        print(query, par)
        return [Product.parse(record) for record in cursor.execute(query, par)] 
    
    return database.transaction(product_get)

def get_all(sort_by: SortBy | None = None, search: str = "") -> list[Product]:
    return get_where(sort_by=sort_by, search=search)

def get_by_id(product_id: int) -> Product:
    def product_get(cursor: Cursor) -> Product:
        record = cursor.execute("SELECT * FROM \"Product\" WHERE product_id = %s", [product_id]).fetchone()

        if not record:
            raise NOT_FOUND
        
        return Product.parse(record)
    
    return database.transaction(product_get)

def get_by_supplier(supplier_id: int, sort_by: SortBy | None = None) -> list[Product]:
    return get_where("supplier_id = %s", [supplier_id], sort_by)

def get_by_category(category: Category, sort_by: SortBy | None = None, search: str = "") -> list[Product]:
    return get_where("category_id = %s", [int(category)], sort_by, search=search)

def get_related(product: Product) -> list[Product]:
    def product_get(cursor: Cursor) -> Product:
        query = """
            SELECT p.*, c.client_name
            FROM "Product" AS p
            JOIN "ClientUser" AS c ON c.client_id = p.supplier_id
            WHERE supplier_id = %s OR category_id = %s
            ORDER BY total_purchases DESC
            LIMIT 4
        """

        return [ProductWithSupplier.parse(record) for record in cursor.execute(query, [product.supplier_id, int(product.category)])] 
    
    return database.transaction(product_get)

def create(product: ProductCreation) -> Product:
    def product_create(cursor: Cursor) -> Product:
        query = """
        INSERT INTO \"Product\" (product_name, description, image_url, unit_price, supplier_id, category_id)
        VALUES (%s, %s, %s, %s, %s, %s) RETURNING *
        """

        try:
            created_product = cursor.execute(query, (
                product.name,
                product.description,
                product.image_url,
                product.unit_price,
                product.supplier_id,
                int(product.category)
            )).fetchone()

            return Product.parse(created_product)
        except CheckViolation:
            raise NEGATIVE_PRICE
    
    return database.transaction(product_create)

def modify(product: ProductModification) -> Product:
    def product_modify(cursor: Cursor) -> Product:
        query = """
        UPDATE "Product"
        SET product_name = %s,
        description = %s,
        image_url = %s,
        unit_price = %s,
        category_id = %s
        WHERE product_id = %s
        RETURNING product_id, product_name, description, image_url, stock, total_purchases, unit_price, supplier_id, category_id, created_at
        """

        modified_product = cursor.execute(query, (product.name, product.description, product.image_url, product.unit_price, int(product.category), product.product_id)).fetchone()
        
        if not modified_product:
            raise NOT_FOUND
        
        return Product.parse(modified_product)
    
    return database.transaction(product_modify)

def modify_stock(product_id: int, stock: int) -> Product:
    def product_stock(cursor: Cursor) -> Product:
        query = """
        UPDATE "Product"
        SET stock = %s
        WHERE product_id = %s
        RETURNING product_id, product_name, description, image_url, stock, total_purchases, unit_price, supplier_id, category_id, created_at
        """

        try:
            modified_product = cursor.execute(query, (stock, product_id)).fetchone()
            
            if not modified_product:
                raise NOT_FOUND
            
            return Product.parse(modified_product)
        except CheckViolation:
            raise NEGATIVE_STOCK
    
    return database.transaction(product_stock)

def unlist(product_id: int) -> None:
    def product_unlist(cursor: Cursor) -> None:
        rowcount = cursor.execute("UPDATE \"Product\" SET supplier_id = 0 WHERE product_id = %s", [product_id])

        if rowcount == 0:
            raise NOT_FOUND
    
    database.transaction(product_unlist)