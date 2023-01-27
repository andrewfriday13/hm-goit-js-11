import axios from 'axios';
import notiflix from 'notiflix';
import "simplelightbox/dist/simple-lightbox.min.css";

let page = 1
async function fetchCountries(getName) {  
try{
  const URL_API = 'https://pixabay.com/api/?key='
  const KEY_API = '33041126-3ffd63b5fde94b48036de795f'
  const URL = `${URL_API}${KEY_API}&q=${getName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  const get = await axios.get(URL)
  return get.data
} catch (err) {
  console.log(err)
  }
}

const searchImg = document.querySelector('.search-form')
const inputForm = document.querySelector('input')
const gallery = document.querySelector('.gallery')
const loadMore = document.querySelector('.load-more')

searchImg.addEventListener('submit', searchBtn)
loadMore.addEventListener('click', loadMoreBtn)

function searchBtn(evt) {
  evt.preventDefault()
 page = 1
  const valueInputForm = inputForm.value
  fetchCountries(valueInputForm).then(data => {
    createCardImg(data)
  })
    .catch(data => console.log(data))

}

function createCardImg(arr) {
  const lengthArr = arr.hits

  if (lengthArr.length === 0) {
    gallery.innerHTML = ""
    loadMore.hidden = true
    notiflix.Notify.failure('не то друже, давай ще в тебе вийде)')
    return
  }
   notiflix.Notify.success(`це воно,${arr.total} найшов:)`)
  const make = arr.hits.map(({ tags, webformatURL, likes, views, comments, downloads }) => `
  
  <div class="photo-card" ">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width= 120 />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>   
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>
  `).join('')

  if (lengthArr.length >= 40) {
    loadMore.hidden = false
  } else {
    loadMore.hidden = true
  }

  gallery.innerHTML= make
  gallery.style.display = "flex"
  gallery.style.flexWrap = "wrap"
  
}
function addCardsImg(arr) {
  const make = arr.hits.map(({ tags,webformatURL,likes, views, comments, downloads })=> `
  <div class="photo-card" ">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width= 120 />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>
  `).join('')
  gallery.insertAdjacentHTML('beforeend', make)
}

function loadMoreBtn() {
  const valueInputForm = inputForm.value
  page+=1
  fetchCountries(valueInputForm).then(data => {
    addCardsImg(data)
    if (data.totalHits <= page * 40) {
      notiflix.Notify.info('Це були останні фоточки, більше нема');
      loadMore.hidden = true
      
    }
  })

}