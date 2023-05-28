"use strict";
let products = [];
async function getProducts(sortBy, search = null, supplierId = null) {
    products = await Api.get(`/api/product${supplierId ? "/supplier/" + supplierId : ""}?sort_by=${sortBy}${search ? "&search=" + search : ""}`);
}
function renderProduct(product, width = 4) {
    const productUrl = `/product?product_id=${product.product_id}`;
    const clientId = Session.get().getUser()?.client_data.client_id;
    const supplierName = "supplier_name" in product ? product.supplier_name : suppliersIndex.get(product.supplier_id).client_data.name;
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
                    <ul class="product-supplier">
                        <li>Supplier:</li>
                        <li><a href=${"/store?supplier=" + product.supplier_id}>${supplierName}</a></li>
                    </ul>
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
                <ul class="product-supplier">
                    <li>Supplier:</li>
                    <li><a href=${"/store?supplier=" + product.supplier_id}>${suppliersIndex.get(product.supplier_id).client_data.name}</a></li>
                </ul>
                <h4 class="product-price">$${product.unit_price}</h4>
            </div>
        </div>
        <!-- product widget -->
    `;
}
