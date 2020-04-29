const key = "qivyMbeL3252shGCXge88F3-1WyvLC3n1Gzf40YG84c";
let pageCount = 1;
const articlePhoto = document.querySelector(".photo")
const container = document.querySelector(".gallery")


export async function Main() {
    let input = document.querySelector(".search-input")

    input.addEventListener('change', () => showSearchedImage(input.value))
}


async function searchForImage(input) {
    let rawData = await fetch(`https://api.unsplash.com/search/photos/?query=${input}&client_id=${key}&per_page=18`)
    return await rawData.json()
}

async function showSearchedImage(input) {
    container.innerHTML=''
    let data = await searchForImage(input)
    let photoData = data.results
    photoData.map(photo => {
        let newArticle = articlePhoto.cloneNode(true)
        newArticle.classList.remove('prototype')
        let img = newArticle.querySelector('img')
        img.setAttribute('src', photo.urls.small)
        container.appendChild(newArticle)
    })
}
