"use strict";
var Category;
(function (Category) {
    Category[Category["Vehicle"] = 1] = "Vehicle";
    Category[Category["Clothing"] = 2] = "Clothing";
    Category[Category["Accessories"] = 3] = "Accessories";
    Category[Category["Sports"] = 4] = "Sports";
    Category[Category["Home"] = 5] = "Home";
    Category[Category["Garden"] = 6] = "Garden";
    Category[Category["Toys"] = 7] = "Toys";
    Category[Category["Business"] = 8] = "Business";
    Category[Category["Industrial"] = 9] = "Industrial";
    Category[Category["Health"] = 10] = "Health";
    Category[Category["Pets"] = 11] = "Pets";
    Category[Category["Electronics"] = 12] = "Electronics";
    Category[Category["School"] = 13] = "School";
    Category[Category["Art"] = 14] = "Art";
})(Category || (Category = {}));
var OrderState;
(function (OrderState) {
    OrderState[OrderState["Confirmed"] = 1] = "Confirmed";
    OrderState[OrderState["Dispatched"] = 2] = "Dispatched";
    OrderState[OrderState["Delivered"] = 3] = "Delivered";
    OrderState[OrderState["Canceled"] = 4] = "Canceled";
})(OrderState || (OrderState = {}));
