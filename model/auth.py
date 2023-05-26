from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel
from model.user import User

class Token(BaseModel):
    access_token: str
    token_type: str
    expires: datetime

class TokenPayload(BaseModel):
    user_id: int
    client_id: int
    exp: datetime = datetime.utcnow()

class UserWithToken(BaseModel):
    user: User
    token: Token