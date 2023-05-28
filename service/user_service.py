import bcrypt

from model.error import NOT_FOUND, USERNAME_EXISTS, UNAUTHORIZED
from model.user import Client, ClientModification, User, UserCreation, Credentials
from db import database
from psycopg import Cursor
from psycopg.errors import UniqueViolation
from fastapi import HTTPException
from config import JWT_ALGORITHM, SECRET_KEY
from model.auth import Token, TokenPayload, UserWithToken
from datetime import timedelta, timezone
from jose import jwt

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

        if not record:
            raise NOT_FOUND
        
        return User.parse(record)
    
    return database.transaction(user_get)

def get_by_client_id(client_id: int) -> User:
    def user_get(cursor: Cursor) -> User:
        record = cursor.execute(f"{BASE_QUERY} WHERE u.client_id = %s", [client_id]).fetchone()

        if not record:
            raise NOT_FOUND
            
        return User.parse(record)
    
    return database.transaction(user_get)

def get_by_username(username: str) -> User:
    def user_get(cursor: Cursor) -> User:
        record = cursor.execute(f"{BASE_QUERY} WHERE u.username = %s", [username]).fetchone()

        if not record:
            raise NOT_FOUND
        
        return User.parse(record)
    
    return database.transaction(user_get)

def get_suppliers() -> User:
    def user_get(cursor: Cursor) -> User:
        query = """
            SELECT u.user_id, u.username, u.client_id, c.client_name, c.email, c.phone_number, c.billing_address
            FROM "ClientUser" AS c
            JOIN (
                SELECT c.client_id, SUM(po.amount) AS total_sales
                FROM "Order" AS o
                JOIN "ProductOrder" AS po ON o.order_id = po.order_id
                RIGHT JOIN "ClientUser" AS c ON c.client_id = o.supplier_id
                GROUP BY c.client_id
                ORDER BY total_sales DESC
            ) AS top_selling ON c.client_id = top_selling.client_id
            JOIN "User" AS u ON u.client_id = c.client_id;
        """
        
        return [User.parse(record) for record in cursor.execute(query)]
    
    return database.transaction(user_get)

def get_by_username_with_password(username: str) -> tuple[User, str]:
    def user_get(cursor: Cursor) -> tuple[User, str]:
        query = """
        SELECT u.user_id, u.username, u.client_id, c.client_name, c.email, c.phone_number, c.billing_address, u.password_hash
        FROM "User" AS u
        JOIN "ClientUser" AS c ON u.user_id = c.client_id
        WHERE u.username = %s"""
        
        record = cursor.execute(query, [username]).fetchone()

        if not record:
            raise NOT_FOUND
        
        return (User.parse(record), record[-1])
    
    return database.transaction(user_get)

def create(user: UserCreation) -> UserWithToken:
    password_hash = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    
    def user_create(cursor: Cursor) -> UserWithToken:
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

        try:
            created_user.user_id = cursor.execute(query, (user.username, password_hash, client.client_id)).fetchone()[0]
            payload = TokenPayload(user_id=created_user.user_id, client_id=created_user.client_data.client_id)
            token = create_token(payload)

            return UserWithToken(user=created_user, token=token)
        except UniqueViolation:
            raise USERNAME_EXISTS
    
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
        
        if not modified_client:
            raise NOT_FOUND
        
        return Client.parse(modified_client)
    
    return database.transaction(client_modify)

def change_password(user_id: int, password: str) -> None:
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    def passwd_change(cursor: Cursor) -> None:
        query = """
        UPDATE "User" SET password_hash = %s
        WHERE user_id = %s
        """

        rowcount = cursor.execute(query, (password_hash, user_id)).rowcount

        if rowcount == 0:
            raise NOT_FOUND
    
    return database.transaction(passwd_change)

def delete(user_id: int) -> None:
    def user_delete(cursor: Cursor) -> None:
        rowcount = cursor.execute("DELETE FROM \"User\" WHERE user_id = %s", [user_id]).rowcount

        if rowcount == 0:
            raise NOT_FOUND
    
    database.transaction(user_delete)

def create_token(payload: TokenPayload) -> Token:
    data = payload.copy()
    data.exp += timedelta(days=1)
    token = jwt.encode(data.dict(), SECRET_KEY, algorithm=JWT_ALGORITHM)

    return Token(access_token=token, token_type="bearer", expires=data.exp.astimezone(timezone.utc))

def login(credentials: Credentials) -> UserWithToken:
    try:
        user, password_hash = get_by_username_with_password(credentials.username)

        if not bcrypt.checkpw(credentials.password.encode("utf-8"), password_hash):
            raise UNAUTHORIZED
        
        payload = TokenPayload(user_id=user.user_id, client_id=user.client_data.client_id)
        token = create_token(payload)

        return UserWithToken(user=user, token=token)
    except HTTPException:
        raise UNAUTHORIZED

def authorize(authorization: str) -> TokenPayload:
    token = authorization.split(" ")[1]
    payload = TokenPayload(**jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM]))

    return payload