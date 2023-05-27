const showSelect = document.getElementById("show-select")! as HTMLSelectElement;
const sortBySelect = document.getElementById("sort-by-select")! as HTMLSelectElement;
const productsContainer = document.getElementById("products-container")! as HTMLDivElement;
const checkboxContainer = document.getElementById("checkbox-container")! as HTMLDivElement;
const showingSpan = document.getElementById("showing-span")! as HTMLSpanElement;
const pagination = document.getElementById("store-pagination")! as HTMLUListElement;
const categoryCheckboxes = checkboxContainer.getElementsByTagName("input");

let page = 1;
let pages = 1;

const priceInput = {
    min: document.getElementById("price-min")! as HTMLInputElement,
    max: document.getElementById("price-max")! as HTMLInputElement
};

let products: Product[] = [];
const selected: Set<Category> = new Set();

sortBySelect.addEventListener("change", getProducts);
showSelect.addEventListener("change", renderProducts);

window.addEventListener("DOMContentLoaded", () => {
    const query = new URLSearchParams(location.search);
    const cat = Number(query.get("category")) as Category;

    if (cat) {
        selected.add(cat);
        categoryCheckboxes[cat - 1].checked = true;
    }
    
    getProducts();
});

for (const checkbox of categoryCheckboxes) {
    const categoryId = checkbox.getAttribute("data-category")!;
    const category = parseInt(categoryId) as Category;

    checkbox.addEventListener("change", () => {
        if (checkbox.checked)
            selected.add(category);
        else
            selected.delete(category);
        
        renderProducts();
    });
}

async function getProducts() {
    const sortBy = sortBySelect.value;
    products = await Api.get(`/api/product?sort_by=${sortBy}`);
    renderProducts();
}

function renderProduct(product: Product) {
    const productUrl = `/product?product_id=${product.product_id}`;
    
    return `
        <!-- product -->
        <div class="col-md-4 col-xs-6">
            <div class="product">
                <a href="${productUrl}">
                    <div class="product-img">
                        <img src="${product.image_url}" onerror="this.src = '/img/fallback.png'" alt="">
                    </div>
                </a>
                <div class="product-body">
                    <p class="product-category">${Category[product.category]}</p>
                    <h3 class="product-name"><a href="${productUrl}">${product.name}</a></h3>
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
                        <button class="quick-view" onclick="location.href='${productUrl}'"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
                    </div>
                </div>
                <div class="add-to-cart">
                    <button class="add-to-cart-btn" onclick="location.href='${productUrl}'"><i class="fa fa-shopping-cart"></i> add to cart</button>
                </div>
            </div>
        </div>
        <!-- /product -->
    `;
}

function setPage(newPage: number) {
    page = newPage;
    renderPagination();
}

function incrementPage() {
    if (page < pages) {
        page++;
        renderPagination();
    }
}

function renderPagination() {
    pagination.innerHTML = ""; 
    
    for (let current = 1; current <= pages; current++) {
        pagination.innerHTML += `<li ${current === page ? 'class="active"' : ""} onclick="setPage(${current})">${current}</li>`;
    }
    
    pagination.innerHTML += `<li onclick="incrementPage()"><i class="fa fa-angle-right"></i></li>`;
}

function renderProducts() {
    const min = parseFloat(priceInput.min.value);
    let max = parseFloat(priceInput.max.value);
    max = max > 998 ? Number.MAX_VALUE : max;
    const show: number = parseInt(showSelect.value);
    let prods: Product[];
    
    if (selected.size == 0)
        prods = products.filter(product => product.unit_price >= min && product.unit_price <= max);
    else
        prods = products.filter(product => selected.has(product.category) && product.unit_price >= min && product.unit_price <= max);
    
    const showing = prods.slice(0, show);
    pages = Math.max(1, Math.ceil(showing.length / show));
    showingSpan.innerText = `${showing.length} - ${prods.length}`;
    productsContainer.innerHTML = showing.map(renderProduct).join("\n");
    renderPagination();
}