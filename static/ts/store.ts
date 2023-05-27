declare const supplier: Client;

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

const selected: Set<Category> = new Set();

sortBySelect.addEventListener("change", getStoreProducts);
showSelect.addEventListener("change", renderProducts);

window.addEventListener("DOMContentLoaded", () => {
    const query = new URLSearchParams(location.search);
    const cat = Number(query.get("category")) as Category;

    if (cat) {
        selected.add(cat);
        categoryCheckboxes[cat - 1].checked = true;
    }
    
    getStoreProducts();
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

async function getStoreProducts() {
    if (supplier) {
        let supplierId: number;

        if (supplier as unknown as number === -1) {
            const clientId = Session.get().getUser()?.client_data.client_id;

            if (!clientId)
                return location.href = "/login";
            
            supplierId = clientId;
            sortBySelect.value = SortBy.Latest;
        } else {
            supplierId = supplier.client_id;
        }

        await getProducts(sortBySelect.value as SortBy, supplierId);
    } else {
        await getProducts(sortBySelect.value as SortBy);
    }

    renderProducts();
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
    productsContainer.innerHTML = showing.map(product => renderProduct(product)).join("\n");
    renderPagination();
}