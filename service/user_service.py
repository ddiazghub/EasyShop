import bcrypt
from model.user import Client, ClientModification, User, UserCreation
from db import database
from psycopg import Cursor

BASE_QUERY = """
SELECT u.user_id, u.username, u.client_id, c.client_name, c.email, c.phone_number, c.billing_address
FROM "User" AS u
JOIN "ClientUser" AS c ON u.user_id = c.client_id
"""

def get_all() -> list[User]:
    def user_get(cursor: Cursor) -> list[User]:
        return [User.parse(record) for record in cursor.execute(BASE_QUERY)] 
    
    return database.transaction(user_get)

def get_by_id(user_id: int) -> User:
    def user_get(cursor: Cursor) -> User:
        record = cursor.execute(f"{BASE_QUERY} WHERE u.user_id = %s", [user_id]).fetchone()

        return User.parse(record)
    
    return database.transaction(user_get)

def get_by_client_id(client_id: int) -> User:
    def user_get(cursor: Cursor) -> User:
        record = cursor.execute(f"{BASE_QUERY} WHERE u.client_id = %s", [client_id]).fetchone()

        return User.parse(record)
    
    return database.transaction(user_get)

def create(user: UserCreation) -> User:
    password_hash = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    
    def user_create(cursor: Cursor) -> User:
        created_user = User(username=user.username, client_data=user.client_data)
        client = created_user.client_data

        query = """
        INSERT INTO \"ClientUser\" (client_name, email, phone_number, billing_address)
        VALUES (%s, %s, %s, %s) RETURNING client_id
        """

        client.client_id = cursor.execute(query, (client.name, client.email, client.phone_number, client.billing_address)).fetchone()[0]

        query = """
        INSERT INTO \"User\" (username, password_hash, client_id)
        VALUES (%s, %s, %s) RETURNING user_id
        """

        created_user.user_id = cursor.execute(query, (user.username, password_hash, client.client_id)).fetchone()[0]

        return created_user
    
    return database.transaction(user_create)

def modify(client: ClientModification) -> Client:
    def client_modify(cursor: Cursor) -> Client:
        query = """
        UPDATE "ClientUser"
        SET client_name = %s,
        email = %s,
        phone_number = %s,
        billing_address = %s
        WHERE client_id = %s
        RETURNING client_id, client_name, email, phone_number, billing_address
        """

        modified_client = cursor.execute(query, (client.name, client.email, client.phone_number, client.billing_address, client.client_id)).fetchone()
        
        return Client.parse(modified_client)
    
    return database.transaction(client_modify)

def change_password(user_id: int, password: str) -> None:
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    def passwd_change(cursor: Cursor) -> None:
        query = """
        UPDATE "User" SET password_hash = %s
        WHERE user_id = %s
        """

        cursor.execute(query, (password_hash, user_id))
    
    return database.transaction(passwd_change)

def delete(user_id: int) -> None:
    def user_delete(cursor: Cursor) -> None:
        cursor.execute("DELETE FROM \"User\" WHERE user_id = %s", [user_id])
    
    return database.transaction(user_delete)