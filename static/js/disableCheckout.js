"use strict";
window.addEventListener("DOMContentLoaded", () => {
    var cart = Cart.get();
    if (cart.isEmpty())
        document.getElementById("checkout-btn").style.pointerEvents = "none";
        document.getElementById("checkout-btn").style.opacity = "0.5";
});