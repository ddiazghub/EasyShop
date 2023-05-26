"use strict";
window.addEventListener("DOMContentLoaded", () => {
    if (Session.get().isActive())
        location.href = "/";
});
