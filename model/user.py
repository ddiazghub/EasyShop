from __future__ import annotations
from pydantic import BaseModel

class Client(BaseModel):
    client_id: int | None = None
    name: str
    email: str
    phone_number: str
    billing_address: str

    @staticmethod
    def parse(result: tuple) -> User:
        return Client(
            client_id=result[0],
            name=result[1],
            email=result[2],
            phone_number=result[3],
            billing_address=result[4]
        )

class ClientCreation(BaseModel):
    name: str
    email: str
    phone_number: str
    billing_address: str

class ClientModification(BaseModel):
    client_id: int
    name: str
    email: str
    phone_number: str
    billing_address: str

class Credentials(BaseModel):
    username: str
    password: str

class UserCreation(BaseModel):
    username: str
    password: str
    client_data: ClientCreation

class User(BaseModel):
    user_id: int | None = None
    username: str
    client_data: Client

    @staticmethod
    def parse(result: tuple) -> User:
        return User(user_id=result[0],
            username=result[1],
            client_data=Client.parse(result[2:]))

class PasswordUpdate(BaseModel):
    password: str