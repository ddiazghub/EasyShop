from fastapi import APIRouter, Response
from model.user import Client, ClientModification, PasswordModification, User, UserCreation
from service import user_service

router = APIRouter(
    prefix="/user",
    tags=["users"],
    responses={
        404: {"description": "Error: User not found"},
        401: {"description": "Unauthorized"},
        204: {"description": "Operation completed successfully"}
    }
)

@router.get("/")
async def get_all_users() -> list[User]:
    return user_service.get_all()

@router.get("/{user_id}")
async def get_by_id(user_id: int) -> User:
    return user_service.get_by_id(user_id)

@router.get("/client/{client_id}")
async def get_by_client_id(client_id: int) -> User:
    return user_service.get_by_client_id(client_id)

@router.post("/")
async def create_user(user: UserCreation) -> User:
    return user_service.create(user)

@router.put("/")
async def modify_client_data(modification: ClientModification) -> Client:
    return user_service.modify(modification)

@router.patch("/password")
async def change_password(modification: PasswordModification) -> Response:
    user_service.change_password(modification.user_id, modification.password)

    return Response(status_code=204)

@router.delete("/{user_id}")
async def delete_user(user_id: int) -> Response:
    user_service.delete(user_id)

    return Response(status_code=204)