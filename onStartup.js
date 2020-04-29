const key = "VLPsY0ev6I5E85TnViUjU_QTdOW7gjL6cdinOxhNxRU";
const sortOrder = "latest";
let pageCount = 1;

const articlePhoto = document.querySelector(".photo");
const container = document.querySelector(".gallery");
let downloadedImages = [];
let favoriteImages = [];

async function loadNewestImagesAtStartup() {
  let response = await fetch(
    `https://api.unsplash.com/photos/?page=${pageCount}&order_by=${sortOrder}&client_id=${key}&per_page=20`
  );
  let data = await response.json();

  for (let i = 0; i < data.length; i++) {
    downloadedImages.push(data[i]);
    let newArticle = articlePhoto.cloneNode(true);

    let anchorTag = document.createElement("a");
    anchorTag.setAttribute("href", data[i].urls.full);
    anchorTag.setAttribute("data-lightbox", "mygallery");
    anchorTag.setAttribute("data-title", data[i].user.name);
    newArticle.appendChild(anchorTag);

    newArticle.classList.remove("prototype");
    let img = newArticle.querySelector("img");
    img.setAttribute("alt", data[i].alt_description);
    img.setAttribute("src", data[i].urls.regular);

    let favoriteBtn = newArticle.querySelector(".favorite");
    favoriteBtn.addEventListener("click", markAsFavorite);

    anchorTag.appendChild(img);
    container.appendChild(newArticle);
  }
}

//TODO fixa - fungerar ej i nyare Chrome-versioner
async function downloadImage() {
  let url = event.target.id;
  let response = await fetch(`${url}/?client_id=${key}`);
  let data = await response.json();
  let downloadLink = data.url;

  let linkCreated = document.createElement("a");
  linkCreated.setAttribute("href", downloadLink);
  linkCreated.setAttribute("download", "output");

  document.body.appendChild(linkCreated);
  linkCreated.click();
  document.body.removeChild(linkCreated);
}

function markAsFavorite() {
  let article = event.target.parentNode;
  console.log(downloadedImages)
  let img = article.querySelector("img");

  let urlToLookFor = img.src;

  for (let i = 0; i < downloadedImages.length; i++) {
    if (downloadedImages[i].urls.regular == urlToLookFor) {
      if (favoriteImages.includes(downloadedImages[i])) {
        //UN-FAVORITE
        favoriteImages.splice(favoriteImages.indexOf(downloadedImages[i]), 1);
        console.log(favoriteImages);
        return;
      }
      //FAVORITE
      favoriteImages.push(downloadedImages[i]);
      console.log(favoriteImages);
    }
  }
}

function loadFavoritesOnStartup() {
  for (let i = 0; i < favoriteImages.length; i++) {
    downloadedImages.push(favoriteImages[i]);
    imageArray[i].addEventListener("click", downloadImage);
    imageArray[i].id = favoriteImages[i].links.download_location;
    imageArray[i].setAttribute("src", favoriteImages[i].urls.regular);
    imageArray[i].setAttribute("alt", favoriteImages[i].alt_description);
  }
}

loadNewestImagesAtStartup();

/*script.js                                  */

const access_key = "qivyMbeL3252shGCXge88F3-1WyvLC3n1Gzf40YG84c";
let page_count = 1;
let maxPage;
const article_photo = document.querySelector(".photo");
const containerGallery = document.querySelector(".gallery");

async function Main() {
  let input = document.querySelector(".search-input");
  let nextPageBtn = document.querySelector(".next-page");
  let prevPageBtn = document.querySelector(".prev-page");

  let newInput;

  input.addEventListener("change", () => {
    newInput = input.value;
    showSearchedImage(newInput, searchForImage);
    nextPageBtn.classList.remove("hidden");
    prevPageBtn.classList.remove("hidden");
  });
  nextPageBtn.addEventListener("click", () =>
    showSearchedImage(newInput, nextPage)
  );
  prevPageBtn.addEventListener("click", () =>
    showSearchedImage(newInput, prevPage)
  );
}

async function searchForImage(input) {
  let rawData = await fetch(
    `https://api.unsplash.com/search/photos/?query=${input}&client_id=${access_key}&per_page=20`
  );
  let data = await rawData.json();
  return data;
}

async function showSearchedImage(input, callback) {
  containerGallery.innerHTML = "";
  downloadedImages = [];
  let data = await callback(input);
  if (data != null) {
    let photoData = data.results;
    photoData.map((photo) => {
      downloadedImages.push(photo);
      let anchorTag = document.createElement("a");
      anchorTag.setAttribute("href", photo.urls.full);
      anchorTag.setAttribute("data-lightbox", "mygallery");
      anchorTag.setAttribute("data-title", photo.user.name);

      let newArticle = article_photo.cloneNode(true);
      newArticle.classList.remove("prototype");
      let img = newArticle.querySelector("img");
      img.setAttribute("src", photo.urls.regular);

      let favoriteBtn = newArticle.querySelector(".favorite");
      favoriteBtn.addEventListener("click", markAsFavorite);

      newArticle.appendChild(anchorTag);
      anchorTag.appendChild(img);
      containerGallery.appendChild(newArticle);
    });
  }
}

async function nextPage(input) {
  page_count++;
  if (page_count !== maxPage) {
    let rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${access_key}&per_page=20&page=${page_count}`
    );
    let data = await rawData.json();
    maxPage = data.total_pages;
    return data;
  } else if (page_count == maxPage) {
    rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${access_key}&per_page=20&page=${maxPage}`
    );
    data = await rawData.json();
    return data;
  }
}

async function prevPage(input) {
  page_count--;
  if (page_count > 1) {
    console.log(page_count);
    let rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${access_key}&per_page=20&page=${page_count}`
    );
    let data = await rawData.json();
    return data;
  } else {
    page_count = 1;
    let rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${access_key}&per_page=20&page=1`
    );
    let data = await rawData.json();
    return data;
  }
}

Main();
