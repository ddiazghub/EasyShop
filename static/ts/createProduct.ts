document.getElementById("create-product-btn")?.addEventListener("click", createProduct);

async function createProduct() {
    const user = Session.get().getUser();

    if (!user)
        throw "Login required for creating products";
    
    const product: ProductCreation = {
        name: textInput("product-name"),
        description: textInput("product-description"),
        unit_price: parseFloat(textInput("unit-price")),
        category: parseInt(textInput("categories")),
        supplier_id: user.user_id
    };

    const element = document.getElementById("image-input")! as HTMLInputElement;

    if (element.files && element.files.length > 0) {
        const file = element.files[0];
        const form = new FormData();
        form.set("file", file);
        product.image_url = await Api.postRaw("/api/file/upload", form);
    }

    console.log("Uploading product: ", product);
    const response: Product = await Api.post("/api/product", product);
    console.log("Product uploaded: ", response);
}