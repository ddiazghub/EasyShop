from typing import Annotated
from fastapi import APIRouter, HTTPException, Header, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from helpers import group_by
from model.product import Category, FakeCategory, ProductList
from model.user import User
from service import product_service, user_service, order_service

router = APIRouter(include_in_schema=False)
templates = Jinja2Templates(directory="templates")

def not_found(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("notfound.html", {"request": request, "categories": Category})

@router.get("/")
async def index(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("index.html", {"request": request, "categories": Category, "current": FakeCategory("Home", 0)})

@router.get("/product")
async def product(request: Request, product_id: int) -> HTMLResponse:
    try:
        product = product_service.get_by_id(product_id)
        supplier = user_service.get_by_client_id(product.supplier_id)

        context = {
            "request": request,
            "categories": Category,
            "product": product,
            "product_json": product.json(),
            "supplier": supplier,
            "supplier_json": supplier.json(),
            "related": ProductList.parse_obj(product_service.get_related(product)).json()
        }

        return templates.TemplateResponse("product.html", context)
    except HTTPException:
        return not_found(request)

@router.get("/checkout")
async def checkout(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("checkout.html", {"request": request, "categories": Category})

@router.get("/store")
async def store(request: Request, category: Category | None = None, supplier: int | None = None) -> HTMLResponse:
    try:
        current: Category | FakeCategory | None = None
        supp: User | None = None
        
        if supplier:
            supp = user_service.get_by_client_id(supplier).client_data
            current = FakeCategory(f"{supp.name}'s Store", -1)
            supp = supp.json()
        elif category:
            current = category
        else:
            current = None
        
        return templates.TemplateResponse("store.html", {"request": request, "categories": Category, "current": current, "supplier": supp})
    except HTTPException:
        return not_found(request)

@router.get("/login")
async def login(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("login.html", {"request": request, "categories": Category})

@router.get("/product-create")
async def create_product(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("create-product.html", {"request": request, "categories": Category})

@router.get("/mystore")
async def store(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("store.html", {"request": request, "categories": Category, "current": FakeCategory("My Store", -1), "supplier": -1})

@router.get("/user")
async def create_product(request: Request, user_id: int | None = None, authorization: Annotated[str | None, Header()] = None) -> HTMLResponse:
    try:    
        if not user_id:
            user_id = user_service.authorize(authorization).user_id
        
        user = user_service.get_by_id(user_id)
            
        return templates.TemplateResponse("user.html", {"request": request, "categories": Category, "user": user, "user_json": user.json()})
    except HTTPException:
        return not_found(request)

@router.get("/orders")
async def orders(request: Request, client: int | None = None, supplier: int | None = None) -> HTMLResponse:
    context = {
        "request": request,
        "categories": Category
    }

    if client and supplier:
        context["client"] = client
        context["supplier"] = supplier
        context["orders"] = order_service.get_by_client_and_supplier(client, supplier)
    elif client:
        context["client"] = client
        context["orders"] = order_service.get_by_client(client)
    elif supplier:
        context["supplier"] = supplier
        context["orders"] = order_service.get_by_supplier(supplier)
    else:
        return not_found(request)

    context["clients"] = group_by(user_service.get_all(), lambda user: user.client_data.client_id)

    return templates.TemplateResponse("orders.html", context)