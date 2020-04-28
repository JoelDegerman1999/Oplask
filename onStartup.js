const key = "VLPsY0ev6I5E85TnViUjU_QTdOW7gjL6cdinOxhNxRU";
const sortOrder = "latest";
let pageCount = 1;

let imageArray = document.querySelectorAll("img");

async function fillImagesAtStartup(){
    let response = await fetch(`https://api.unsplash.com/photos/?page=${pageCount}&order_by=${sortOrder}&client_id=${key}`);
    let data = await response.json();

    console.log(data);

    for(let i = 0; i < data.length; i++){
        imageArray[i].addEventListener("click", downloadImage);
        imageArray[i].id = data[i].links.download;
        imageArray[i].setAttribute("src", data[i].urls.small);
        imageArray[i].setAttribute("alt", data[i].alt_description);
    }
}

//fungerar ej - TODO fixa
function downloadImage(){
    let linkCreated =  document.createElement("a");

    //event.target.id innehåller download-länken
    linkCreated.setAttribute("href", event.target.id);
    linkCreated.setAttribute("download", event.target.id);
    linkCreated.click();
    linkCreated.parentNode.removeChild(linkCreated);
}

fillImagesAtStartup();