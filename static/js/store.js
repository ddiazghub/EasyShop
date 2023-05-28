"use strict";
const showSelect = document.getElementById("show-select");
const sortBySelect = document.getElementById("sort-by-select");
const productsContainer = document.getElementById("products-container");
const checkboxContainer = document.getElementById("checkbox-container");
const showingSpan = document.getElementById("showing-span");
const pagination = document.getElementById("store-pagination");
const categoryCheckboxes = checkboxContainer.getElementsByTagName("input");
const query = new URLSearchParams(location.search);
let page = 1;
let pages = 1;
const priceInput = {
    min: document.getElementById("price-min"),
    max: document.getElementById("price-max")
};
const selected = new Set();
sortBySelect.addEventListener("change", getStoreProducts);
showSelect.addEventListener("change", renderProducts);
window.addEventListener("DOMContentLoaded", async () => {
    const cat = Number(query.get("category"));
    if (cat) {
        selected.add(cat);
        categoryCheckboxes[cat - 1].checked = true;
    }
    await getSuppliers();
    getStoreProducts();
});
for (const checkbox of categoryCheckboxes) {
    const categoryId = checkbox.getAttribute("data-category");
    const category = parseInt(categoryId);
    checkbox.addEventListener("change", () => {
        if (checkbox.checked)
            selected.add(category);
        else
            selected.delete(category);
        renderProducts();
    });
}
async function getStoreProducts() {
    const search = query.get("search");
    if (supplier) {
        let supplierId;
        if (supplier === -1) {
            const clientId = Session.get().getUser()?.client_data.client_id;
            if (!clientId)
                return location.href = "/login";
            supplierId = clientId;
            sortBySelect.value = SortBy.Latest;
        }
        else {
            supplierId = supplier.client_id;
        }
        await getProducts(sortBySelect.value, search, supplierId);
    }
    else {
        await getProducts(sortBySelect.value, search);
    }
    renderProducts();
}
function setPage(newPage) {
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
    const show = parseInt(showSelect.value);
    let prods;
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
