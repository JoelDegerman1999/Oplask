const key = "qivyMbeL3252shGCXge88F3-1WyvLC3n1Gzf40YG84c";
let pageCount = 1;
let maxPage;
const articlePhoto = document.querySelector(".photo");
const container = document.querySelector(".gallery");

async function Main() {
  let input = document.querySelector(".search-input");
  let nextPageBtn = document.querySelector(".next-page");
  let prevPageBtn = document.querySelector(".prev-page");

  let newInput;

  input.addEventListener("change", () => {
    newInput = input.value;
    showSearchedImage(newInput, searchForImage);
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
    `https://api.unsplash.com/search/photos/?query=${input}&client_id=${key}&per_page=18&page=${pageCount}`
  );
  let data = await rawData.json();
  return data;
}

async function showSearchedImage(input, callback) {
  container.innerHTML = "";
  let data = await callback(input);
  if (data != null) {
    let photoData = data.results;
    console.log(photoData);
    photoData.map((photo) => {
      let newArticle = articlePhoto.cloneNode(true);
      newArticle.classList.remove("prototype");
      let img = newArticle.querySelector("img");
      img.setAttribute("src", photo.urls.small);
      container.appendChild(newArticle);
    });
  }
}

async function nextPage(input) {
  pageCount++;
  if (pageCount !== maxPage) {
    console.log("pagecount: " + pageCount);
    let rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${key}&per_page=18&page=${pageCount}`
    );
    let data = await rawData.json();
    maxPage = data.total_pages;
    return data;
  } else if (pageCount == maxPage) {
    console.log("här");
    rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${key}&per_page=18&page=${maxPage}`
    );
    data = await rawData.json();
    return data;
  }
}

async function prevPage(input) {
  pageCount--;
  console.log("pagecount-prev : " + pageCount);
  if (pageCount > 1) {
    console.log(pageCount);
    let rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${key}&per_page=18&page=${pageCount}`
    );
    let data = await rawData.json();
    return data;
  } else {
    pageCount = 1;
    let rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${key}&per_page=18&page=1`
    );
    let data = await rawData.json();
    return data;
  }
}

Main();
