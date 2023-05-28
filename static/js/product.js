"use strict";
const amountPicker = document.getElementById("product-amount");
const stockLabel = document.getElementById("product-stock");
const relatedContainer = document.getElementById("related-products-container");
const addToCartButton = document.getElementById("add-to-cart-btn");
const showModal = document.getElementById("show-modal-btn");
const modalBody = document.getElementById("modal-body");
let ownsProduct;
window.addEventListener("DOMContentLoaded", async () => {
    const amount = Cart.get().getAmount(product);
    if (amount)
        reduceMax(amount);
    renderRelated();
    triggerSlicks();
    const clientId = Session.get().getUser()?.client_data.client_id;
    ownsProduct = product.supplier_id == clientId;
    let icon;
    let innerText;
    let handler;
    if (ownsProduct) {
        icon = "plus";
        innerText = "Modify Stock";
        handler = addStock;
        amountPicker.max = Number.MAX_SAFE_INTEGER.toString();
        amountPicker.value = product.stock.toString();
        modalBody.innerText = "Product stock modified successfully";
    }
    else {
        icon = "shopping-cart";
        innerText = "Add to Cart";
        handler = addToCart;
        amountPicker.addEventListener("change", onPickerChange);
    }
    addToCartButton.innerHTML = `<i class="fa fa-${icon}"></i> ${innerText}`;
    addToCartButton.addEventListener("click", handler);
});
function onPickerChange() {
    const amount = parseInt(amountPicker.value);
    if (amount < 0)
        amountPicker.value = "0";
    else if (amount > parseInt(amountPicker.max))
        amountPicker.value = amountPicker.max;
}
function addToCart() {
    const amount = parseInt(amountPicker.value);
    if (amount == 0)
        return;
    Cart.get().add(product, amount);
    reduceMax(amount);
    showModal.click();
}
async function addStock() {
    const amount = parseInt(amountPicker.value);
    if (amount == 0)
        return;
    const modification = {
        product_id: product.product_id,
        stock: amount
    };
    const prod = await Api.patch("/api/product/stock", modification);
    product.stock = prod.stock;
    showModal.click();
    stockLabel.innerText = prod.stock > 0 ? `${prod.stock} Units In Stock` : "Unavailable";
}
function reduceMax(amount) {
    const newMax = parseInt(amountPicker.max) - amount;
    const str = newMax.toString();
    amountPicker.max = str;
    stockLabel.innerText = newMax > 0 ? `${newMax} Units In Stock` : "Unavailable";
}
function renderRelated() {
    relatedContainer.innerHTML = `
        <div class="col-md-12">
            <div class="section-title text-center">
                <h3 class="title">Related Products</h3>
            </div>
        </div>

        ${related.map(product => renderProduct(product, 3)).join("\n")}
    `;
}
