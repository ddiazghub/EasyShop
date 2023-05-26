from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from jose import JWTError, ExpiredSignatureError
from db.create_db import create_database
from docs import API_DESCRIPTION
from controllers.api_controller import router as api
from controllers.client_controller import router as client

import logging
import json

from model.error import UNAUTHORIZED

"""Checks if database exists on startup and creates it if doesn't"""
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_database()
    yield
    pass

app = FastAPI(
    lifespan=lifespan,
    title="EasyShop E-Commerce Platform",
    description=API_DESCRIPTION,
)

log = logging.getLogger(__name__)

@app.exception_handler(JWTError)
@app.exception_handler(ExpiredSignatureError)
async def validation_exception_handler(request: Request, exc: JWTError | ExpiredSignatureError):
    return Response(json.dumps({ "detail": "Expired or invalid access token" }), status_code=401, headers=UNAUTHORIZED.headers)

app.include_router(api)
app.include_router(client)
app.mount("/", StaticFiles(directory="static", html=True), name="static")

"""
@app.get("/accidents", tags=["accidents"])
async def get_accidents(
    fields: Annotated[list[str], Query(description=FIELDS_DESCRIPTION)] = [],
    start: Annotated[str | None, Query(description=START_DESCRIPTION)] = None,
    end: Annotated[str | None, Query(description=END_DESCRIPTION)] = None,
    limit: Annotated[int, Query(description=LIMIT_DESCRIPTION)] = 100
) -> list[Accident]:
    return accidents(fields, start, end, limit)
"""