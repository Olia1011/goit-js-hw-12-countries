import debounce from 'lodash.debounce';
import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/PNotifyBrightTheme.css';
import fetchCountriesList from './fetchCountriesList';
import details from '../templates/Description.hbs';

const refs = {
  input: document.querySelector('.input'),
  showCountries: document.querySelector('.showCountries'),
  rezOfSeach: document.querySelector('.rez'),
};

refs.input.addEventListener('input', debounce(searchObject, 500));
refs.input.addEventListener('blur', search);
refs.input.addEventListener('focus', getRez);

function searchObject(e) {
  e.preventDefault();
  const searchQuery = e.target.value;

  fetchCountriesList(searchQuery)
    .then(data => {
      if (data.length === 1) {
       refs.showCountries.innerHTML = '';
        allCountries(data);
        PNotify.closeAll();
      } else if (data.length >= 2 && data.length <= 10) {
        allItems(data);
        PNotify.closeAll();

      } else if (data.length > 10) {
        const error = PNotify.error({
          text: 'Too many matches found. Please enter a more specific query!',
          modules: {
            Buttons: {
              closer: false,
              sticker: false,
            },
          },
        });
        error.on('click', function () {
          error.close();
        });
      }
    })
    .catch(error => console.error('ERROR---', error));
}

function search() {
  refs.input.value = '';
}

function template({ name }) {
  return `
  <li class="showCountries__item">
  <p>${name}</p>
  </li>
  `;
}

function allItems(data) {
  const list = data.map(country => template(country)).join('');
  refs.showCountries.insertAdjacentHTML('beforeend', list);
}

function allCountries(data) {
  const markup = data.map(country => details(country)).join('');
  refs.rezOfSeach.innerHTML = markup;
}

function getRez() {
  refs.rezOfSeach.innerHTML = '';
  refs.showCountries.innerHTML = '';
}
