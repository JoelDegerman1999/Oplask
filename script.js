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
    `https://api.unsplash.com/search/photos/?query=${input}&client_id=${access_key}&per_page=18`
  );
  let data = await rawData.json();
  return data;
}

async function showSearchedImage(input, callback) {
  containerGallery.innerHTML = "";
  let data = await callback(input);
  if (data != null) {
    let photoData = data.results;
    photoData.map((photo) => {
      let newArticle = article_photo.cloneNode(true);
      newArticle.classList.remove("prototype");
      let img = newArticle.querySelector("img");
      img.setAttribute("src", photo.urls.small);
      containerGallery.appendChild(newArticle);
    });
  }
}

async function nextPage(input) {
  page_count++;
  if (page_count !== maxPage) {
    let rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${access_key}&per_page=18&page=${page_count}`
    );
    let data = await rawData.json();
    maxPage = data.total_pages;
    return data;
  } else if (page_count == maxPage) {
    console.log("här");
    rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${access_key}&per_page=18&page=${maxPage}`
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
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${access_key}&per_page=18&page=${page_count}`
    );
    let data = await rawData.json();
    return data;
  } else {
    page_count = 1;
    let rawData = await fetch(
      `https://api.unsplash.com/search/photos/?query=${input}&client_id=${access_key}&per_page=18&page=1`
    );
    let data = await rawData.json();
    return data;
  }
}

Main();
