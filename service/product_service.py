from model.product import Category, ProductCreation, Product, ProductModification
from psycopg import Cursor
from db import database

def get_all() -> list[Product]:
    def product_get(cursor: Cursor) -> list[Product]:
        return [Product.parse(record) for record in cursor.execute("SELECT * FROM \"Product\"")] 
    
    return database.transaction(product_get)

def get_by_id(product_id: int) -> Product:
    def product_get(cursor: Cursor) -> Product:
        record = cursor.execute("SELECT * FROM \"Product\" WHERE product_id = %s", (product_id,)).fetchone()

        return Product.parse(record)
    
    return database.transaction(product_get)

def get_by_supplier(supplier_id: int) -> list[Product]:
    def product_get(cursor: Cursor) -> list[Product]:
        return [Product.parse(record) for record in cursor.execute("SELECT * FROM \"Product\" WHERE supplier_id = %s", (supplier_id,))]
    
    return database.transaction(product_get)

def get_by_category(category: Category) -> list[Product]:
    def product_get(cursor: Cursor) -> list[Product]:
        return [Product.parse(record) for record in cursor.execute("SELECT * FROM \"Product\" WHERE category_id = %s", (int(category),))]
    
    return database.transaction(product_get)

def create(product: ProductCreation) -> Product:
    def product_create(cursor: Cursor) -> Product:
        created_product = Product(
            name=product.name,
            description=product.description,
            image_url=product.image_url,
            stock=0,
            unit_price=product.unit_price,
            total_purchases=0,
            supplier_id=product.supplier_id,
            category=product.category
        )

        query = """
        INSERT INTO \"Product\" (product_name, description, image_url, unit_price, supplier_id, category_id)
        VALUES (%s, %s, %s, %s, %s, %s) RETURNING product_id
        """

        created_product.product_id = cursor.execute(query, (
            product.name,
            product.description,
            product.image_url,
            product.unit_price,
            product.supplier_id,
            int(product.category)
        )).fetchone()[0]

        return created_product
    
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
        RETURNING product_id, product_name, description, image_url, stock, total_purchases, unit_price, supplier_id, category_id
        """

        modified_product = cursor.execute(query, (product.name, product.description, product.image_url, product.unit_price, int(product.category), product.product_id)).fetchone()
        
        return Product.parse(modified_product)
    
    return database.transaction(product_modify)

def modify_stock(product_id: int, stock: int) -> Product:
    def product_stock(cursor: Cursor) -> Product:
        query = """
        UPDATE "Product"
        SET stock = %s
        WHERE product_id = %s
        RETURNING product_id, product_name, description, image_url, stock, total_purchases, unit_price, supplier_id, category_id
        """

        modified_product = cursor.execute(query, (stock, product_id)).fetchone()
        
        return Product.parse(modified_product)
    
    return database.transaction(product_stock)

def unlist(product_id: int) -> None:
    def product_unlist(cursor: Cursor) -> None:
        cursor.execute("UPDATE \"Product\" SET supplier_id = 0 WHERE product_id = %s", [product_id])
    
    database.transaction(product_unlist)