interface Product {
    product_id: number,
    name: string,
    description: string | null,
    image_url: string | null,
    stock: number,
    unit_price: number,
    total_purchases: number,
    supplier_id: number,
    category: Category,
    created_at: Date
}

interface ProductCreation {
    name: string,
    description: string,
    image_url?: string,
    unit_price: number,
    supplier_id: number,
    category: Category
}
    
interface CartEntry {
    product: Product,
    amount: number
}