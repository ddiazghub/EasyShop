from fastapi import HTTPException

NOT_FOUND = HTTPException(status_code=404, detail="The requested item was not found")
USERNAME_EXISTS = HTTPException(status_code=409, detail="The selected username already exists")
NEGATIVE_PRICE = HTTPException(status_code=400, detail="Product price can't be negative")
NEGATIVE_STOCK = HTTPException(status_code=400, detail="Product stock can't be negative")
INSUFFICIENT_STOCK = HTTPException(status_code=400, detail="One or more of the products in the order have less stock than requested")
FILE_TOO_LARGE = HTTPException(status_code=400, detail="Uploaded images can't be larger than 5MB")
CANT_KNOW_FILETYPE = HTTPException(status_code=400, detail="The uploaded image's filetype can't be known because the filename is missing")

UNAUTHORIZED = HTTPException(
    status_code=401,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)