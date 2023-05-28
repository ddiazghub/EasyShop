"use strict";
const searchBar = document.getElementById("search-bar");
const categorySelector = document.getElementById("category-selector");
const searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", () => {
    const search = searchBar.value;
    const category = categorySelector.value;
    if (search === "" && category === "")
        location.href = "/store";
    else if (search === "")
        location.href = `/store?category=${category}`;
    else if (category === "")
        location.href = `/store?search=${search}`;
    else
        location.href = `/store?${"search=" + search}&${"category=" + category}`;
});
