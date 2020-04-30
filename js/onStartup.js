const erik_key = "VLPsY0ev6I5E85TnViUjU_QTdOW7gjL6cdinOxhNxRU";
const joel_key = "qivyMbeL3252shGCXge88F3-1WyvLC3n1Gzf40YG84c";

const sortOrder = "latest";
let pageCount = 1;
let maxPage;
const articlePhoto = document.querySelector(".photo");
const container = document.querySelector(".gallery");
let downloadedImages = [];

let favoriteImages = JSON.parse(localStorage.getItem("favoriteImages"));
if (favoriteImages == null) favoriteImages = [];

async function loadNewestImagesAtStartup() {
  let response = await fetch(
    `https://api.unsplash.com/photos/?page=${pageCount}&order_by=${sortOrder}&client_id=${erik_key}&per_page=20`
  );
  let data = await response.json();

  data.map((photo) => {
    downloadedImages.push(photo);
    let newArticle = articlePhoto.cloneNode(true);

    let anchorTag = document.createElement("a");
    anchorTag.setAttribute("href", photo.urls.full);
    anchorTag.setAttribute("data-lightbox", "mygallery");
    anchorTag.setAttribute("data-title", photo.user.name);
    newArticle.appendChild(anchorTag);

    newArticle.classList.remove("prototype");
    let img = newArticle.querySelector(".img-photo");
    img.setAttribute("alt", photo.alt_description);
    img.setAttribute("src", photo.urls.regular);

    let favoriteBtn = newArticle.querySelector(".favorite");
    favoriteBtn.addEventListener("click", () => markAsFavorite());

    anchorTag.appendChild(img);
    container.appendChild(newArticle);
  });

  let allImg = document.querySelectorAll(".favorite");
  favoriteImages.forEach((favorite) => {
    for (let i = 0; i < downloadedImages.length; i++) {
      if (favorite.id == downloadedImages[i].id) {
        allImg[i + 1].src = "http://127.0.0.1:5500/img/full-like.png";
      }
    }
  });
}

function markAsFavorite() {
  let isSame = false;
  let article = event.target.parentNode;
  let img = article.querySelector(".img-photo");
  let urlToLookFor = img.src;
  for (let i = 0; i < downloadedImages.length; i++) {
    if (downloadedImages[i].urls.regular == urlToLookFor) {
      favoriteImages.forEach((element) => {
        if (element.id == downloadedImages[i].id) {
          isSame = true;
        }
      });
      if (isSame) {
        if (returnWhichHtmlSite() == "favorites.html")
          favoriteImages.splice(i, 1);
      } else {
        favoriteImages.push(downloadedImages[i]);
      }
      let favoriteImg = event.target.parentNode.querySelector(".favorite");
      if (favoriteImg.src == "http://127.0.0.1:5500/img/like.png")
        favoriteImg.src = "http://127.0.0.1:5500/img/full-like.png";
    }
  }
  localStorage.setItem("favoriteImages", JSON.stringify(favoriteImages));

  if (returnWhichHtmlSite() == "favorites.html") {
    location.reload();
  }
}

function loadFavoritesOnStartup() {
  let favorites = favoriteImages;

  let clearStorageBtn = document.querySelector(".clear-storage");

  clearStorageBtn.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });

  for (let i = 0; i < favorites.length; i++) {
    downloadedImages.push(favorites[i]);
    let newArticle = articlePhoto.cloneNode(true);

    let anchorTag = document.createElement("a");
    anchorTag.setAttribute("href", favorites[i].urls.full);
    anchorTag.setAttribute("data-lightbox", "mygallery");
    anchorTag.setAttribute("data-title", favorites[i].user.name);
    newArticle.appendChild(anchorTag);

    newArticle.classList.remove("prototype");
    let img = newArticle.querySelector(".img-photo");
    img.setAttribute("alt", favorites[i].alt_description);
    img.setAttribute("src", favorites[i].urls.regular);

    let favoriteBtn = newArticle.querySelector(".favorite");
    favoriteBtn.addEventListener("click", markAsFavorite);

    anchorTag.appendChild(img);
    container.appendChild(newArticle);
  }

  let likeSymbols = document.querySelectorAll(".favorite");
  likeSymbols.forEach((element) => {
    element.src = "http://127.0.0.1:5500/img/full-like.png";
  });
}

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
    `https://api.unsplash.com/search/photos/?query=${input}&client_id=${joel_key}&per_page=20`
  );
  let data = await rawData.json();
  return data;
}

async function showSearchedImage(input, callback) {
  container.innerHTML = "";
  downloadedImages = [];
  let data = await callback(input);
  if (data == null) return;

  data.results.map((photo) => {
    downloadedImages.push(photo);
    let anchorTag = document.createElement("a");
    anchorTag.setAttribute("href", photo.urls.full);
    anchorTag.setAttribute("data-lightbox", "mygallery");
    anchorTag.setAttribute("data-title", photo.user.name);

    let newArticle = articlePhoto.cloneNode(true);
    newArticle.classList.remove("prototype");
    let img = newArticle.querySelector(".img-photo");
    img.setAttribute("src", photo.urls.regular);

    let favoriteBtn = newArticle.querySelector(".favorite");
    favoriteBtn.addEventListener("click", () => {
      markAsFavorite();
    });

    newArticle.appendChild(anchorTag);
    anchorTag.appendChild(img);
    container.appendChild(newArticle);
  });
}

async function nextPage(input) {
  pageCount++;
  if (pageCount !== maxPage) {
    let rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${joel_key}&per_page=20&page=${pageCount}`
    );
    let data = await rawData.json();
    maxPage = data.total_pages;
    return data;
  } else if (pageCount == maxPage) {
    rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${joel_key}&per_page=20&page=${maxPage}`
    );
    data = await rawData.json();
    return data;
  }
}

async function prevPage(input) {
  pageCount--;
  if (pageCount > 1) {
    console.log(pageCount);
    let rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${joel_key}&per_page=20&page=${pageCount}`
    );
    let data = await rawData.json();
    return data;
  } else {
    pageCount = 1;
    let rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${joel_key}&per_page=20&page=${pageCount}`
    );
    let data = await rawData.json();
    return data;
  }
}

function returnWhichHtmlSite() {
  return window.location.pathname.split("/").pop();
}

if (returnWhichHtmlSite() == "index.html") {
  loadNewestImagesAtStartup();
} else if (returnWhichHtmlSite() == "favorites.html") {
  loadFavoritesOnStartup();
}
Main();
