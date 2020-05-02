import newGallery from './fetchGallery';
import galleryTemplate from './templates/galleryCards.hbs';
import Pnotify from '../node_modules/pnotify/dist/es/PNotify';
import '../node_modules/pnotify/dist/PNotifyBrightTheme.css';
import * as basicLightbox from 'basiclightbox';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchValue: document.querySelector('#search-form input'),
  gallery: document.querySelector('.gallery'),
  buttonLoad: document.querySelector('.btn-load'),
  buttonUp: document.querySelector('.btn-up'),
  buttonDown: document.querySelector('.btn-down'),
  block: document.querySelector('#down'),
};

refs.buttonLoad.disabled = true;
refs.buttonUp.disabled = true;
refs.buttonDown.disabled = true;

refs.searchForm.addEventListener('submit', searchImage);

function searchImage(e) {
  e.preventDefault();
  newGallery.resetPage();
  clearGallery();
  refs.buttonLoad.disabled = true;
  refs.buttonUp.disabled = true;
  refs.buttonDown.disabled = true;

  const query = refs.searchValue.value;
  newGallery.query = query;
  if (query) {
    refs.buttonLoad.disabled = false;
    refs.buttonUp.disabled = false;
    refs.buttonDown.disabled = false;

    newGallery.fetchGallery().then(hits => {
      if (!hits.length) {
        pnotifyInfoNoMatches();
        return;
      }
      const markup = buildListGallery(hits);
      insertListGallery(markup);
    });
  }
}

refs.buttonLoad.addEventListener('click', loadMore);
refs.buttonUp.addEventListener('click', buttonUp);
refs.buttonDown.addEventListener('click', buttonDown);

function buildListGallery(items) {
  return galleryTemplate(items);
}
function insertListGallery(items) {
  refs.gallery.insertAdjacentHTML('beforeend', items);
  refs.buttonLoad.style.display = 'block';
  refs.buttonUp.style.cssText = `display: block; position: fixed;
  bottom: 10px;
  right: 50px;
  border-radius: 50px`;
  refs.buttonDown.style.cssText = `display: block; position: fixed;
  bottom: 10px;
  right: 150px;
  border-radius: 50px`;
}
function loadMore() {
  newGallery.fetchGallery().then(hits => {
    console.log(hits);

    const markup = buildListGallery(hits);
    insertListGallery(markup);
    windowScroll();
  });
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}
function buttonUp() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
function buttonDown() {
  refs.block.scrollIntoView({
    top: false,
    behavior: 'smooth',
  });
}

function windowScroll() {
  window.scrollBy({
    top: window.innerHeight,
    left: 0,
    behavior: 'smooth',
  });
}

function pnotifyInfoNoMatches() {
  Pnotify.info({
    title: 'Упс',
    text: 'Ничего не найдено',
    delay: 1500,
  });
}
refs.gallery.addEventListener('click', showImg);
function showImg(e) {
  const parent = findTheParent(e.target);
  const img = parent.querySelector('.img')
  const instance = basicLightbox.create(
    `<img src="${img.src}" width="800" height="600">`,
  );
  instance.show();
}

function findTheParent(child) {
  return (parent =
    child.classList[0] !== 'photo-card' ? findTheParent(child.parentNode) : child);
}
