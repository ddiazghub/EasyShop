from fastapi import APIRouter, Response
from service import product_service
from model.product import Category, Product, ProductCreation, ProductModification, SortBy, StockModification

router = APIRouter(
    prefix="/product",
    tags=["products"],
    responses={
        404: {"description": "Error: Product not found"},
        204: {"description": "Operation completed successfully"}
    }
)

@router.get("")
async def get_all_products(sort_by: SortBy | None = None, search: str = "", category: Category | None = None) -> list[Product]:
    if category:
        return product_service.get_by_category(category, sort_by, search)
    else:
        return product_service.get_all(sort_by, search)

@router.get("/{product_id}")
async def get_by_id(product_id: int) -> Product:
    return product_service.get_by_id(product_id)

@router.get("/supplier/{supplier_id}")
async def get_by_supplier_id(supplier_id: int, sort_by: SortBy | None = None) -> list[Product]:
    return product_service.get_by_supplier(supplier_id, sort_by)

@router.get("/category/{category}")
async def get_by_category(category: Category, sort_by: SortBy | None = None, search: str = "") -> list[Product]:
    return product_service.get_by_category(category, sort_by)

@router.post("")
async def create_product(product: ProductCreation) -> Product:
    return product_service.create(product)

@router.put("")
async def modify_product(modification: ProductModification) -> Product:
    return product_service.modify(modification)

@router.patch("/stock")
async def modify_product_stock(modification: StockModification) -> Product:
    return product_service.modify_stock(modification.product_id, modification.stock)

@router.delete("/{product_id}")
async def unlist_product(product_id: int) -> Response:
    product_service.unlist(product_id)

    return Response(status_code=204)