from typing import Annotated
from fastapi import APIRouter, HTTPException, Header, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from model.product import Category, FakeCategory, ProductList
from service import product_service, user_service

router = APIRouter(include_in_schema=False)
templates = Jinja2Templates(directory="templates")

@router.get("/")
async def index(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("index.html", {"request": request, "categories": Category, "current": FakeCategory("Home", 0)})

@router.get("/product")
async def product(request: Request, product_id: int) -> HTMLResponse:
    context = {"request": request, "categories": Category}

    try:
        product = product_service.get_by_id(product_id)
        context["product"] = product
        context["product_json"] = product.json()
        context["related"] = ProductList.parse_obj(product_service.get_related(product)).json()

        return templates.TemplateResponse("product.html", context)
    except HTTPException:
        return templates.TemplateResponse("notfound.html", context)

@router.get("/checkout")
async def checkout(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("checkout.html", {"request": request, "categories": Category})

@router.get("/store")
async def store(request: Request, category: Category | None = None) -> HTMLResponse:
    return templates.TemplateResponse("store.html", {"request": request, "categories": Category, "current": category if category else None})

@router.get("/login")
async def login(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("login.html", {"request": request, "categories": Category})

@router.get("/product-create")
async def create_product(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("create-product.html", {"request": request, "categories": Category})

@router.get("/mystore")
async def store(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("store.html", {"request": request, "categories": Category, "current": FakeCategory("My Store", -1), "supplier": -1})