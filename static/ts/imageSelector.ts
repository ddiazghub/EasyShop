const dropArea = document.getElementById("image-dropbox")! as HTMLDivElement;
const button = document.getElementById("image-btn")! as HTMLButtonElement;
const dragText = document.getElementById("drag-text")! as HTMLHeadingElement;
const input = document.getElementById("image-input")! as HTMLInputElement;
 
button.onclick = () => input.click();
["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => dropArea.addEventListener(eventName, preventDefaults, false));
["dragenter", "dragover"].forEach(eventName => dropArea.addEventListener(eventName, highlight));
["dragleave", "drop"].forEach(eventName => dropArea.addEventListener(eventName, unhighlight));
dropArea.addEventListener("drop", handleDrop);
input.addEventListener("change", handleFiles);

function preventDefaults(e: Event) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e: Event) {
    dropArea.classList.add('highlight')
}

function unhighlight(e: Event) {
    dropArea.classList.remove('highlight')
}

function handleDrop(e: DragEvent) {
    input.files = e.dataTransfer!.files;
    handleFiles();
}

function handleFiles() {
    const image = input.files ? input.files[0] : null;

    if (image && /.*((png)|(PNG)|(jpe?g)|(JPE?G))/.test(image.type)) {        
        const imageUrl = URL.createObjectURL(image);

        dragText.innerHTML = `
            <div id="product-main-img">
                <div class="product-preview">
                    <img src="${imageUrl}" alt="">
                </div>
            </div>
        `;
        button.innerText = "Change Image";
    } else {
        input.files = null;
        document.getElementById("invalid-file")!.hidden = false;
        dragText.innerHTML = `<h4>Select Image here</h4>`;
        button.innerText = "Choose Image";
    }
}