"use strict";
window.addEventListener("DOMContentLoaded", () => {
    var cart = Cart.get();
    console.log("Llego aca")
    if (cart.isEmpty())
        console.log("Cart: "+cart+". Is empty")
        document.getElementById("checkout-btn").style.pointerEvents = "none";
        document.getElementById("checkout-btn").style.opacity = "0.5";
});