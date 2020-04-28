// async function loadLatestImages(){
//     let response = await fetch("https://api.unsplash.com/photos/random");
//     let data = await response.json();
//     console.log(data);
// }

// loadLatestImages();

const key = "VLPsY0ev6I5E85TnViUjU_QTdOW7gjL6cdinOxhNxRU";
let pageCount = 1;
let image = document.querySelector("img");

function getListOfImages(){
     fetch(`https://api.unsplash.com/photos/?client_id=${key}`)
    .then(response => response.json())
    .then(data => console.log(data));
}

getListOfImages();