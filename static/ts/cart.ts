const cartList = document.getElementById("cart-list")! as HTMLDivElement;
const subtotalSpan = document.getElementById("order-subtotal")! as HTMLSpanElement;

class Cart {
    static instance: Cart;

    cart: Map<number, CartEntry>;
    subtotal: number;

    constructor(entries: CartEntry[] = []) {
        this.cart = new Map();
        this.subtotal = 0.0;

        for (const entry of entries) {
            this.cart.set(entry.product.product_id, entry);
            this.subtotal += entry.amount * entry.product.unit_price;
        }

        this.render();
    }

    add(product: Product, amount: number) {
        const entry = this.cart.get(product.product_id);

        if (entry) {
            entry.amount += amount;
            document.getElementById(`product-${product.product_id}-amount`)!.innerText = `${amount}x`;
        } else {
            const entry = { product, amount };
            this.cart.set(product.product_id, entry);
            cartList.innerHTML += Cart.renderProduct(entry);
        }
        
        this.subtotal += product.unit_price * amount;
        subtotalSpan.innerText = this.subtotal.toString();
        this.save();
        console.log("Added items to cart, new state: ", this.cart);
    }

    contains(productId: number): boolean {
        return this.cart.has(productId);
    }

    isEmpty(): boolean {
        return this.cart.size === 0;
    }

    remove(productId: number) {
        const entry = this.cart.get(productId);

        if (entry) {
            this.subtotal -= entry.amount * entry.product.unit_price;
            subtotalSpan.innerText = this.subtotal.toString();
            this.cart.delete(productId);
            this.render();
            console.log("Removed items from cart, new state: ", this.cart);
            this.save();
        }
    }

    save() {
        const entries = [...this.cart.values()];
        window.localStorage.setItem("cart", JSON.stringify(entries));
    }

    render() {
        cartList.innerHTML = "";

        for (const entry of this.cart.values()) {
            cartList.innerHTML += Cart.renderProduct(entry);
        }
    }

    static renderProduct({ product, amount }: CartEntry): string {
        return `
            <div class="product-widget">
                <div class="product-img">
                    <img src="${product.image_url}" alt="">
                </div>
                <div class="product-body">
                    <h3 class="product-name"><a href="/product?product_id=${product.product_id}">${product.name}</a></h3>
                    <h4 class="product-price"><span class="qty" id="product-${product.product_id}-amount">${amount}x</span>$${product.unit_price}</h4>
                </div>
                <button class="delete" onclick="Cart.get().remove(${product.product_id})"><i class="fa fa-close"></i></button>
            </div>
        `;
    }

    static load(): Cart {
        const cartJson = window.localStorage.getItem("cart") ?? "[]";
        const cart: CartEntry[] = JSON.parse(cartJson);
        console.log("Loaded cart from localstorage: ", cart);

        return new Cart(cart);
    }

    static get(): Cart {
        if (!Cart.instance)
            Cart.instance = Cart.load();
        
        return Cart.instance;
    }
}

window.addEventListener("DOMContentLoaded", Cart.get);