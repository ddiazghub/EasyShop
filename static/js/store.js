"use strict";
const showSelect = document.getElementById("show-select");
const sortBySelect = document.getElementById("sort-by-select");
const productsContainer = document.getElementById("products-container");
const checkboxContainer = document.getElementById("checkbox-container");
const priceInput = {
    min: document.getElementById("price-min"),
    max: document.getElementById("price-max")
};
let products = [];
const selected = new Set();
window.addEventListener("DOMContentLoaded", getProducts);
sortBySelect.addEventListener("change", getProducts);
showSelect.addEventListener("change", renderProducts);
for (const checkbox of checkboxContainer.getElementsByTagName("input")) {
    const categoryId = checkbox.getAttribute("data-category");
    const category = parseInt(categoryId);
    checkbox.addEventListener("change", () => {
        if (checkbox.checked)
            selected.add(category);
        else
            selected.delete(category);
        renderProducts();
    });
}
async function getProducts() {
    const sortBy = sortBySelect.value;
    products = await Api.get(`/api/product?sort_by=${sortBy}`);
    renderProducts();
}
function renderProduct(product) {
    const productUrl = `/product?product_id=${product.product_id}`;
    return `
        <!-- product -->
        <div class="col-md-4 col-xs-6">
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
                        <button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
                    </div>
                </div>
                <div class="add-to-cart">
                    <button class="add-to-cart-btn"><i class="fa fa-shopping-cart"></i> add to cart</button>
                </div>
            </div>
        </div>
        <!-- /product -->
    `;
}
function renderProducts() {
    const min = parseFloat(priceInput.min.value);
    let max = parseFloat(priceInput.max.value);
    max = max > 998 ? Number.MAX_VALUE : max;
    const show = parseInt(showSelect.value);
    let prods;
    if (selected.size == 0)
        prods = products.filter(product => product.unit_price >= min && product.unit_price <= max);
    else
        prods = products.filter(product => selected.has(product.category) && product.unit_price >= min && product.unit_price <= max);
    productsContainer.innerHTML = prods.slice(0, show).map(renderProduct).join("\n");
}
