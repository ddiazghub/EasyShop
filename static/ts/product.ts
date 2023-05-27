declare const product: Product;
declare const related: Product[];

const amountPicker = document.getElementById("product-amount")! as HTMLInputElement;
const stockLabel = document.getElementById("product-stock")! as HTMLSpanElement;
const relatedContainer = document.getElementById("related-products-container")! as HTMLDivElement;
const addToCartButton = document.getElementById("add-to-cart-btn")! as HTMLButtonElement;
const showModal = document.getElementById("show-modal-btn")! as HTMLButtonElement;
const modalBody = document.getElementById("modal-body")! as HTMLDivElement;

let ownsProduct: boolean;

window.addEventListener("DOMContentLoaded", () => {
    const amount = Cart.get().getAmount(product);

    if (amount)
        reduceMax(amount);
    
    renderRelated();
    triggerSlicks();
    const clientId = Session.get().getUser()?.client_data.client_id;
    ownsProduct = product.supplier_id == clientId;
    let icon: string;
    let innerText: string;
    let handler: () => void;

    if (ownsProduct) {
        icon = "plus";
        innerText = "Modify Stock";
        handler = addStock;
        amountPicker.max = Number.MAX_SAFE_INTEGER.toString();
        amountPicker.value = product.stock.toString();
        modalBody.innerText = "Product stock modified successfully";
    } else {
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
    
    const modification: StockModification = {
        product_id: product.product_id,
        stock: amount
    };

    const prod: Product = await Api.patch("/api/product/stock", modification);
    product.stock = prod.stock;
    showModal.click();
    stockLabel.innerText = prod.stock > 0 ? `${prod.stock} Units In Stock` : "Unavailable";
}


function reduceMax(amount: number) {
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