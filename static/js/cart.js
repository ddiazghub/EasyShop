"use strict";
const cartList = document.getElementById("cart-list");
const subtotalSpan = document.getElementById("order-subtotal");
const itemQuantityDiv = document.getElementById("order-item-qty-div");
const itemQuantitySpan = document.getElementById("order-item-qty");
class Cart {
    static instance;
    cart;
    subtotal;
    size;
    constructor(entries = []) {
        this.cart = new Map();
        this.subtotal = 0.0;
        this.size = entries.length;
        for (const entry of entries) {
            const order = this.getSupplierOrder(entry.product.supplier_id);
            order.set(entry.product.product_id, entry);
            this.subtotal += entry.amount * entry.product.unit_price;
        }
        this.render();
    }
    add(product, amount) {
        if (amount == 0)
            return;
        enableCheckout();
        const order = this.getSupplierOrder(product.supplier_id);
        const entry = order.get(product.product_id);
        if (entry) {
            entry.amount += amount;
            document.getElementById(`product-${product.product_id}-amount`).innerText = `${entry.amount}x`;
        }
        else {
            const entry = { product, amount };
            order.set(product.product_id, entry);
            this.size++;
        }
        this.subtotal += product.unit_price * amount;
        this.render();
        this.save();
        console.log("Added items to cart, new state: ", this.cart);
    }
    contains(product) {
        return this.cart.get(product.supplier_id)?.has(product.product_id) ?? false;
    }
    getAmount(product) {
        return this.cart.get(product.supplier_id)?.get(product.product_id)?.amount ?? null;
    }
    isEmpty() {
        return this.cart.size === 0;
    }
    remove(product) {
        if (this.cart.has(product.supplier_id)) {
            const order = this.cart.get(product.supplier_id);
            const entry = order.get(product.product_id);
            if (entry) {
                this.subtotal -= entry.amount * entry.product.unit_price;
                order.delete(product.product_id);
                if (order.size == 0)
                    this.cart.delete(product.supplier_id);
                this.size--;
                this.render();
                console.log("Removed items from cart, new state: ", this.cart);
                this.save();
                if (this.size === 0)
                    disableCheckout();
            }
        }
    }
    save() {
        const entries = [];
        for (const order of this.cart.values()) {
            for (const entry of order.values()) {
                entries.push(entry);
            }
        }
        window.localStorage.setItem("cart", JSON.stringify(entries));
    }
    getSupplierOrder(supplierId) {
        let supplierOrder = this.cart.get(supplierId);
        if (!supplierOrder) {
            supplierOrder = new Map();
            this.cart.set(supplierId, supplierOrder);
        }
        return supplierOrder;
    }
    renderText() {
        subtotalSpan.innerText = this.subtotal.toString();
        itemQuantityDiv.innerText = this.size.toString();
        itemQuantitySpan.innerText = this.size.toString();
    }
    render() {
        this.renderText();
        cartList.innerHTML = "";
        for (const [supplierId, order] of this.cart) {
            cartList.innerHTML += Cart.renderSupplier(supplierId);
            for (const entry of order.values())
                cartList.innerHTML += Cart.renderProduct(entry);
        }
    }
    static renderSupplier(supplierId) {
        return `
            <hr style='margin-top: 10px; margin-bottom: 10px'>
            <strong>Supplier: ${supplierId}</strong>
            <hr style='margin-top: 10px; margin-bottom: 10px'>
        `;
    }
    static renderProduct({ product, amount }) {
        return `
            <div class="product-widget">
                <div class="product-img">
                    <img src="${product.image_url}" onerror="this.src='/img/fallback.png'" alt="">
                </div>
                <div class="product-body">
                    <h3 class="product-name"><a href="/product?product_id=${product.product_id}">${product.name}</a></h3>
                    <h4 class="product-price"><span class="qty" id="product-${product.product_id}-amount">${amount}x</span>$${product.unit_price}</h4>
                </div>
                <button class="delete" onclick="Cart.get().remove({product_id: ${product.product_id}, supplier_id: ${product.supplier_id}})"><i class="fa fa-close"></i></button>
            </div>
        `;
    }
    static load() {
        const cartJson = window.localStorage.getItem("cart") ?? "[]";
        const cart = JSON.parse(cartJson);
        console.log("Loaded cart from localstorage: ", cart);
        return new Cart(cart);
    }
    static get() {
        if (!Cart.instance)
            Cart.instance = Cart.load();
        return Cart.instance;
    }
}
window.addEventListener("DOMContentLoaded", Cart.get);
