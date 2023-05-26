from typing import Annotated
from fastapi import APIRouter, Header, UploadFile
from model.auth import UserWithToken
from service import user_service, file_service

router = APIRouter(
    prefix="/file",
    tags=["files"],
    responses={
        404: {"description": "Error: User not found"},
        401: {"description": "Unauthorized"},
        204: {"description": "Operation completed successfully"}
    }
)

@router.post("/upload")
async def file_upload(authorization: Annotated[str, Header()], file: UploadFile) -> str:
    user_service.authorize(authorization)

    return await file_service.upload_file(file)