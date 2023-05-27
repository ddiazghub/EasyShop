const boton = document.getElementById("botonOrder");
const displaydiv = document.getElementById("displaydiv");
getOrders();
async function getOrders(){
    const orders = await Api.get("/api/order");
    displaydiv.innerHTML = ""
    for (const order of orders){
        displaydiv.innerHTML += "<p>"+order.order_id+" "+order.supplier_id+" "+order.total_cost+" "+order.purchase_date+" "+order.delivery_date+" "+order.state+"</p>"
    }
}
