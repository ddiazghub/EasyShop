from fastapi import APIRouter
from controllers.order_controller import router as order_controller
from controllers.product_controller import router as product_controller
from controllers.user_controller import router as user_controller
from controllers.file_controller import router as file_controller

router = APIRouter(prefix="/api")
router.include_router(order_controller)
router.include_router(product_controller)
router.include_router(user_controller)
router.include_router(file_controller)