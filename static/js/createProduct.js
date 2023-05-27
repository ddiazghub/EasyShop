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
var _a;
(_a = document.getElementById("create-product-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", createProduct);
function createProduct() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = Session.get().getUser();
        if (!user)
            throw "Login required for creating products";
        const product = {
            name: textInput("product-name"),
            description: textInput("product-description"),
            unit_price: parseFloat(textInput("unit-price")),
            category: parseInt(textInput("categories")),
            supplier_id: user.user_id
        };
        const element = document.getElementById("image-input");
        if (element.files && element.files.length > 0) {
            const file = element.files[0];
            const form = new FormData();
            form.set("file", file);
            product.image_url = yield Api.postRaw("/api/file/upload", form);
        }
        console.log("Uploading product: ", product);
        const response = yield Api.post("/api/product", product);
        console.log("Product uploaded: ", response);
        location.href = "/mystore";
    });
}
