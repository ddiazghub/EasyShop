"use strict";
const newContainer = document.getElementById("new-products-container");
const topContainer = document.getElementById("top-selling-container");
const newWidgetContainer = document.getElementById("new-products-widget");
const topWidgetContainer = document.getElementById("top-selling-widget");
const bestWidgetContainer = document.getElementById("best-rated-widget");
let popular = [];
window.addEventListener("DOMContentLoaded", initializeIndex);
async function initializeIndex() {
    const promise = getSuppliers();
    await getProducts(SortBy.Latest);
    await promise;
    renderIndexProducts();
}
function renderWidgets(container, products) {
    container.innerHTML = "";
    for (let i = 0; i < products.length; i += 3) {
        container.innerHTML += `
            <div>
                ${products.slice(i, i + 3).map(product => renderProductWidget(product)).join("\n")}
            </div>
        `;
    }
}
function renderIndexProducts() {
    popular = [...products];
    popular.sort((first, second) => second.total_purchases - first.total_purchases);
    const mostPopular = popular.slice(0, 15);
    const newest = products.slice(0, 15);
    newContainer.innerHTML = newest.map(product => renderProduct(product)).join("\n");
    topContainer.innerHTML = mostPopular.map(product => renderProduct(product)).join("\n");
    renderWidgets(newWidgetContainer, newest);
    renderWidgets(topWidgetContainer, mostPopular);
    renderWidgets(bestWidgetContainer, newest);
    triggerSlicks();
}
