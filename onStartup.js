const key = "VLPsY0ev6I5E85TnViUjU_QTdOW7gjL6cdinOxhNxRU";
const sortOrder = "latest";
let pageCount = 1;

let imageArray = document.querySelectorAll("img");
let downloadedImages = [];
let favoriteImages = [];

async function loadNewestImagesAtStartup(){
    let response = await fetch(`https://api.unsplash.com/photos/?page=${pageCount}&order_by=${sortOrder}&client_id=${key}`);
    let data = await response.json();

    for(let i = 0; i < data.length; i++){
        downloadedImages.push(data[i]);
        imageArray[i].addEventListener("click", downloadImage);
        imageArray[i].id = data[i].links.download_location;
        imageArray[i].setAttribute("src", data[i].urls.small);
        imageArray[i].setAttribute("alt", data[i].alt_description);
    }

    //ge alla knappar funktionen att spara till favorit-listan
    let selectButtons = document.querySelectorAll("button");
    selectButtons.forEach(element => {
        element.addEventListener("click", markAsFavorite);
    });
}

//TODO fixa - fungerar ej i nyare Chrome-versioner
async function downloadImage(){
   
    let url = event.target.id;
    let response = await fetch(`${url}/?client_id=${key}`);
    let data = await response.json();
    let downloadLink = data.url;

    let linkCreated =  document.createElement("a");
    linkCreated.setAttribute("href", downloadLink);
    linkCreated.setAttribute("download", "output");

    document.body.appendChild(linkCreated);
    linkCreated.click();
    document.body.removeChild(linkCreated);
}

function markAsFavorite(){

    let urlToLookFor = event.target.parentNode.lastChild.src;

    for(let i = 0; i < downloadedImages.length; i++){
        if(downloadedImages[i].urls.small == urlToLookFor){
            if(favoriteImages.includes(downloadedImages[i])){
                //UN-FAVORITE
                favoriteImages.splice(favoriteImages.indexOf(downloadedImages[i]),1);
                console.log(favoriteImages);
                return;
            }
            //FAVORITE
            favoriteImages.push(downloadedImages[i]);
            console.log(favoriteImages);
        }
    }
}

function loadFavoritesOnStartup(){
    
    for(let i = 0; i < favoriteImages.length; i++){
        downloadedImages.push(favoriteImages[i]);
        imageArray[i].addEventListener("click", downloadImage);
        imageArray[i].id = favoriteImages[i].links.download_location;
        imageArray[i].setAttribute("src", favoriteImages[i].urls.small);
        imageArray[i].setAttribute("alt", favoriteImages[i].alt_description);
    }
}

loadNewestImagesAtStartup();