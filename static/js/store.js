"use strict";
const showSelect = document.getElementById("show-select");
const sortBySelect = document.getElementById("sort-by-select");
const productsContainer = document.getElementById("products-container");
let products = [];
window.addEventListener("DOMContentLoaded", getProducts);
sortBySelect.addEventListener("change", getProducts);
showSelect.addEventListener("change", renderProducts);
async function getProducts() {
    const sortBy = sortBySelect.value;
    products = await Api.get(`/api/product?sort_by=${sortBy}`);
    renderProducts();
}
function renderProducts() {
    const show = parseInt(showSelect.value);
    productsContainer.innerHTML = products.slice(0, show).map(product => {
        return `
            <!-- product -->
            <div class="col-md-4 col-xs-6">
                <div class="product">
                    <div class="product-img">
                        <img src="${product.image_url}" alt="">
                    </div>
                    <div class="product-body">
                        <p class="product-category">${product.category}</p>
                        <h3 class="product-name"><a href="/product?product_id=${product.product_id}">${product.name}</a></h3>
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
    }).join("\n");
}
