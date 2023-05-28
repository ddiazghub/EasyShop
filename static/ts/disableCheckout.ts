const checkoutButton = document.getElementById("checkout-btn")! as HTMLAnchorElement;

window.addEventListener("DOMContentLoaded", () => {
    const cart = Cart.get();
    
    if (cart.isEmpty())
        disableCheckout();
});

function disableCheckout() {
    checkoutButton.style.pointerEvents = "none";
    checkoutButton.style.opacity = "0.5";
    checkoutButton.href = "#";
    const url = new URL(location.href);

    if (url.pathname === "/checkout")
        location.href = "/";
}

function enableCheckout() {
    checkoutButton.style.pointerEvents = "auto";
    checkoutButton.style.opacity = "1";
    checkoutButton.href = "/checkout";
}