"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const newContainer = document.getElementById("new-products-container");
const topContainer = document.getElementById("top-selling-container");
const newWidgetContainer = document.getElementById("new-products-widget");
const topWidgetContainer = document.getElementById("top-selling-widget");
const bestWidgetContainer = document.getElementById("best-rated-widget");
let popular = [];
window.addEventListener("DOMContentLoaded", getIndexProducts);
function getIndexProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        yield getProducts(SortBy.Latest);
        renderIndexProducts();
    });
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
