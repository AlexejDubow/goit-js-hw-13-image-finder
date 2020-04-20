const baseUrl =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal';

export default {
  page: 1,
  perPage: 12,
  query: '',
  key: '16116679-c72078e20d7f40e9b0a227bf4',
  fetchGallery() {
    const requestParams = `&q=${this.query}&page=${this.page}&per_page=${this.perPage}`;

    return fetch(baseUrl + `&key=${this.key}` + requestParams)
      .then(response => response.json())
      .then(parsed => {
        this.incrementPage();
        return parsed.hits;
      });
  },
  get searchQuery(){
    return this.query
  },
  set searchQuery(value){
    this.query = value
  },
  incrementPage() {
    this.page += 1;
  },
  resetPage(){
    this.page = 1
  },
};
