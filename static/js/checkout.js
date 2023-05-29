"use strict";
const orderProductsContainer = document.getElementById("order-products-container");
const orderTotalSpan = document.getElementById("order-total");
const orderNotesArea = document.getElementById("order-notes-area");
document.getElementById("checkout-button").addEventListener("click", () => checkout());
window.addEventListener("DOMContentLoaded", () => {
    const cart = Cart.get();
    if (cart.isEmpty())
        history.back();
    const user = Session.get().getUser();
    document.getElementById("client-details").innerHTML = user ? userDetails(user) : unregistered();
    orderProductsContainer.innerHTML = "";
    orderTotalSpan.innerText = cart.subtotal.toString();
    for (const [supplierId, order] of cart.cart) {
        orderProductsContainer.innerHTML += `
            <hr style='margin-top: 10px; margin-bottom: 10px'>
            <strong>Supplier: ${supplierId}</strong>
            <hr style='margin-top: 10px; margin-bottom: 10px'>
        `;
        for (const { amount, product } of order.values()) {
            orderProductsContainer.innerHTML += `
                <div class="order-col">
                    <div>${amount}x ${product.name}</div>
                    <div>$${product.unit_price}</div>
                </div>
            `;
        }
    }
});
async function checkout() {
    const session = Session.get();
    let user = session.getUser();
    const cart = Cart.get();
    if (!user) {
        await session.register(false);
        user = session.getUser();
    }
    for (const [supplierId, supplierOrder] of cart.cart) {
        const products = [...supplierOrder.values()];
        const order = {
            client_id: user.client_data.client_id,
            supplier_id: supplierId,
            order_notes: orderNotesArea.value,
            products: products.map(entry => ({
                product_id: entry.product.product_id,
                amount: entry.amount
            }))
        };
        console.log("Sending order to server: ", order);
        const response = await Api.post("/api/order", order);
        console.log("Created order: ", response);
    }
    cart.clear();
    location.href = `/orders?client=${user.client_data.client_id}`;
}
function unregistered() {
    return `
    <!-- Billing Details -->
    <div class="billing-details">
        <div class="section-title">
            <h3 class="title">Billing and shipping address</h3>
        </div>
        <div class="form-group">
            <input class="input" type="text" id="full-name" placeholder="Full Name" required>
        </div>
        <div class="form-group">
            <input class="input" type="email" id="email" placeholder="Email" required>
        </div>
        <div class="form-group">
            <input class="input" type="text" id="address" placeholder="Address" required>
        </div>
        <div class="form-group">
            <input class="input" type="text" id="city" placeholder="City" required>
        </div>
        <div class="form-group">
            <input class="input" type="text" id="country" placeholder="Country" required>
        </div>
        <div class="form-group">
            <input class="input" type="tel" id="phone" placeholder="Phone Number" required>
        </div>
    </div>
    <!-- Billing Details -->

    <!-- Account Details-->
    <div class="account-details">
        <div class="section-title">
            <h3 class="title">Account details</h3>
        </div>
        <div id="sign-up-failed" class="alert alert-danger alert-dismissible" role="alert" hidden>
            <button type="button" class="close hide-parent" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            The username already exists.
        </div>
        <p>Being registered is needed for placing orders.</p>
        <div class="form-group">
            <input class="input" type="text" id="username" placeholder="Username" required>
        </div>
        <div class="form-group">
            <input class="input" type="password" id="password" placeholder="Enter Your Password" required>
        </div>
    </div>
    <!-- Account Details-->
    `;
}
function userDetails(user) {
    return `
    <!-- Billing Details -->
    <div class="billing-details">
        <div class="section-title">
            <h3 class="title">Billing and shipping address</h3>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-3">
                <h6 class="mb-0">Full Name</h6>
            </div>
            <div class="col-sm-9 text-secondary">
                ${user.client_data.name}
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-3">
                <h6 class="mb-0">Email</h6>
            </div>
            <div class="col-sm-9 text-secondary">
                ${user.client_data.email}
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-3">
                <h6 class="mb-0">Address</h6>
            </div>
            <div class="col-sm-9 text-secondary">
                ${user.client_data.billing_address}
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-3">
                <h6 class="mb-0">City</h6>
            </div>
            <div class="col-sm-9 text-secondary">
                ${"Somewhere"}
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-3">
                <h6 class="mb-0">Country</h6>
            </div>
            <div class="col-sm-9 text-secondary">
                ${"IDK"}
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-3">
                <h6 class="mb-0">Phone Number</h6>
            </div>
            <div class="col-sm-9 text-secondary">
                ${user.client_data.phone_number}
            </div>
        </div>
        <hr>
    </div>
    <!-- Billing Details -->
    `;
}
