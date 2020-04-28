import debounce from 'lodash.debounce';
import 'material-design-icons';
import newGallery from './fetchGallery';
import galleryTemplate from './templates/galleryCards.hbs';

const refs = {
  searchQuery: document.querySelector('.search-form-btn'),
  searchValue: document.querySelector('#search-form input'),
  gallery: document.querySelector('.gallery'),
  buttonLoad: document.querySelector('.btn-load'),
  buttonUp: document.querySelector('.btn-up'),
};

refs.buttonLoad.disabled = true;
refs.buttonUp.disabled = true;

refs.searchQuery.addEventListener('click', searchImage);

function searchImage(e) {
  e.preventDefault();
  newGallery.resetPage();
  clearGallery();
  refs.buttonLoad.disabled = true;
  refs.buttonUp.disabled = true;

  const query = refs.searchValue.value;
  newGallery.query = query;

  if (query) {
    refs.buttonLoad.disabled = false;
    refs.buttonUp.disabled = false;

    newGallery.fetchGallery().then(hits => {
      const markup = buildListGallery(hits);
      insertListGallery(markup);
    });
  }
}

refs.buttonLoad.addEventListener('click', loadMore);
refs.buttonUp.addEventListener('click', buttonUp);

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
}
function loadMore() {
  newGallery.fetchGallery().then(hits => {
    const markup = buildListGallery(hits);
    insertListGallery(markup);
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
