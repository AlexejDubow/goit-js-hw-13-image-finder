import debounce from 'lodash.debounce';
import 'material-design-icons';
import newGallery from './fetchGallery';
import galleryTemplate from './templates/galleryCards.hbs';

const refs = {
  searchForm: document.querySelector('#search-form input'),
  gallery: document.querySelector('.gallery'),
  buttonLoad: document.querySelector('.btn-load'),
  buttonUp: document.querySelector('.btn-up'),
};

refs.buttonLoad.disabled = true;
refs.buttonUp.disabled = true;

refs.searchForm.addEventListener(
  'input',
  debounce(searchFormInputListener, 800),
);

function searchFormInputListener() {
  newGallery.resetPage();
  clearGallery();
  refs.buttonLoad.disabled = true;
  refs.buttonUp.disabled = true;

  const searchQuery = refs.searchForm.value;
  newGallery.query = searchQuery;

  if (searchQuery) {
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
