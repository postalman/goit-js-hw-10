import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import COUNTRIES from './fetchCountries';
import markUpOne from './counterone.hbs';
import markUpFull from './counterfull.hbs';

const DEBOUNCE_DELAY = 300;

const debounce = require('lodash.debounce');

const input = document.querySelector('#search-box');
const countryDoc = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  if (e.target.value.trim().length === 0) {
    return removeInfo();
  }

  COUNTRIES.fetchCountries(`${e.target.value.trim()}`)
    .then(c => {
      if (c.length > 10) {
        return onAlert();
      } else if (c.length !== 1) {
        return onCountries(c);
      }

      onOneCountry(c);
    })
    .catch(error => {
      onError();
    });
}

function onError() {
  Notify.failure('Oops, there is no country with that name');
  removeInfo();
}

function onAlert() {
  Notify.info('Too many matches found. Please enter a more specific name.');
  removeInfo();
}

function onCountries(c) {
  removeInfo();
  const allCountries = markUpOne(c);

  countryDoc.insertAdjacentHTML('beforeend', allCountries);
}

function onOneCountry(c) {
  removeInfo();
  const oneCountry = markUpFull(c);

  countryDoc.insertAdjacentHTML('beforeend', oneCountry);
}

function removeInfo() {
  countryDoc.innerHTML = '';
}
