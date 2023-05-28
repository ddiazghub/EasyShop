let suppliers: User[] = []
const suppliersIndex: Map<number, User> = new Map();

async function getSuppliers() {
    suppliers = await Api.get("/api/user/suppliers");

    for (const supplier of suppliers)
        suppliersIndex.set(supplier.client_data.client_id, supplier);
}