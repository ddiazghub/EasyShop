"use strict";
const amountPicker = document.getElementById("product-amount");
const stockLabel = document.getElementById("product-stock");
document.getElementById("add-to-cart-btn").addEventListener("click", addToCart);
amountPicker.addEventListener("change", onPickerChange);
window.addEventListener("DOMContentLoaded", () => {
    const amount = Cart.get().getAmount(product);
    if (amount)
        reduceMax(amount);
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
    const showModal = document.getElementById("show-modal-btn");
    reduceMax(amount);
    showModal.click();
}
function reduceMax(amount) {
    const newMax = parseInt(amountPicker.max) - amount;
    const str = newMax.toString();
    amountPicker.max = str;
    stockLabel.innerText = newMax > 0 ? `${newMax} Units In Stock` : "Unavailable";
}
