"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let products = [];
function getProducts(sortBy, supplierId = null) {
    return __awaiter(this, void 0, void 0, function* () {
        products = yield Api.get(`/api/product${supplierId ? "/supplier/" + supplierId : ""}?sort_by=${sortBy}`);
    });
}
function renderProduct(product, width = 4) {
    var _a;
    const productUrl = `/product?product_id=${product.product_id}`;
    const clientId = (_a = Session.get().getUser()) === null || _a === void 0 ? void 0 : _a.client_data.client_id;
    return `
        <!-- product -->
        <div class="col-md-${width} col-xs-6">
            <div class="product">
                <a href="${productUrl}">
                    <div class="product-img">
                        <img src="${product.image_url}" onerror="this.src = '/img/fallback.png'" alt="">
                    </div>
                </a>
                <div class="product-body">
                    <p class="product-category">${Category[product.category]}</p>
                    <h3 class="product-name"><a href="${productUrl}">${product.name}</a></h3>
                    <h4 class="product-price">$${product.unit_price}</h4>
                    <div class="product-rating">
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                    </div>
                    <div class="product-btns">
                        <button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
                        <button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>
                        <button class="quick-view" onclick="location.href='${productUrl}'"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
                    </div>
                </div>
                <div class="add-to-cart">
                    <button class="add-to-cart-btn" onclick="location.href='${productUrl}'"><i class="fa fa-shopping-cart"></i> ${product.supplier_id === clientId ? "Modify Stock" : "Add to Cart"}</button>
                </div>
            </div>
        </div>
        <!-- /product -->
    `;
}
function renderProductWidget(product) {
    const productUrl = `/product?product_id=${product.product_id}`;
    return `
        <!-- product widget -->
        <div class="product-widget">
            <a href="${productUrl}">
                <div class="product-img">
                    <img src="${product.image_url}" onerror="this.src = '/img/fallback.png'" alt="">
                </div>
            </a>
            <div class="product-body">
                <p class="product-category">${Category[product.category]}</p>
                <h3 class="product-name"><a href="${productUrl}">${product.name}</a></h3>
                <h4 class="product-price">$${product.unit_price}</h4>
            </div>
        </div>
        <!-- product widget -->
    `;
}
