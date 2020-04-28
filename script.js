const key = "qivyMbeL3252shGCXge88F3-1WyvLC3n1Gzf40YG84c";
let pageCount = 1;
let maxPage
const articlePhoto = document.querySelector(".photo")
const container = document.querySelector(".gallery")


async function Main() {
    let input = document.querySelector(".search-input")
    let nextPageBtn = document.querySelector('.next-page')

    input.addEventListener('change', () => showSearchedImage(input.value))
    nextPageBtn.addEventListener('click', () => {
        pageCount++
        showSearchedImage(input.value)
    })
}


async function searchForImage(input) {
    console.log(pageCount)
    if(pageCount < maxPage){
        let rawData = await fetch(`https://api.unsplash.com/search/photos/?query=${input}&client_id=${key}&per_page=18&page=${pageCount}`)
        let data = await rawData.json()
        maxPage = data.total_pages
        console.log(maxPage)
        return data
    }else {
        console.log("else")
    }
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













Main()