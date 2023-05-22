from typing import Annotated
from fastapi import FastAPI
from fastapi.params import Query
from contextlib import asynccontextmanager
from db.create_db import create_database
from docs import API_DESCRIPTION
from controllers import user_controller, product_controller

import logging

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
app.include_router(user_controller.router)
app.include_router(product_controller.router)

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