interface OrderCreation {
    client_id: number,
    supplier_id: number,
    products: ProductOrder[],
    order_notes: string
}

interface Order {
    order_id: number,
    client_id: number,
    supplier_id: number,
    total_cost: number,
    order_notes: string,
    purchase_date: Date,
    delivery_date: Date,
    state: OrderState
}

interface ProductOrder {
    product_id: number,
    amount: number
}