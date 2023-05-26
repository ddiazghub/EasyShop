"use strict";
function textInput(id) {
    const element = document.getElementById(id);
    if (!element.reportValidity())
        throw "Invalid field value";
    return element.value;
}
for (const element of document.getElementsByClassName("hide-parent")) {
    element.addEventListener("click", () => {
        element.parentElement.hidden = true;
    });
}
