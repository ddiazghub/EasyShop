"use strict";
const orderHistoryButton = document.getElementById("order-history-btn");
const receivedHistoryButton = document.getElementById("received-history-btn");
const logoutButton = document.getElementById("logout-btn");
const userStoreButton = document.getElementById("user-store-btn");
window.addEventListener("DOMContentLoaded", () => {
    const currentUser = Session.get().getUser();
    if (!currentUser)
        return location.href = "/login";
    const clientId = currentUser.client_data.client_id;
    userStoreButton.href = `/store?supplier=${clientId}`;
    if (currentUser.user_id === user.user_id) {
        orderHistoryButton.href = `/orders?client=${clientId}`;
        receivedHistoryButton.href = `/orders?supplier=${clientId}`;
        userStoreButton.innerText = "Visit My Store";
        logoutButton.addEventListener("click", () => {
            const currentUser = Session.get().getUser();
            if (!currentUser)
                location.href = "/login";
            Session.get().kill(false);
            location.href = "/";
        });
    }
    else {
        orderHistoryButton.style.display = "none";
        receivedHistoryButton.href = `/orders?client=${clientId}&supplier=${user.client_data.client_id}`;
        receivedHistoryButton.innerText = "My Orders For This Supplier";
        logoutButton.style.display = "none";
        userStoreButton.innerText = "Visit Supplier's Store";
    }
});
