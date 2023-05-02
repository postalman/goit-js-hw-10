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
        removeInfo();
        return;
    }
    
    COUNTRIES.fetchCountries(`${e.target.value.trim()}`).then(c => {
        if (c.status === 404) {
            onError();
            return;
        } else if (c.length > 10) {
            onAlert();
            return;
        } else if (c.length !== 1) {
            onCountries(c);
            return;
        }
        onOneCountry(c);
    });
        
}

function onError() {
    Notify.failure('Oops, there is no country with that name');
    removeInfo();
}

function onAlert () {
    Notify.info('Too many matches found. Please enter a more specific name.');
    removeInfo();
}

function onCountries(c) {
    const allCountries = markUpOne(c);
    countryDoc.innerHTML = allCountries;
}

function onOneCountry(c) {
    const oneCountry = markUpFull(c);
    countryDoc.innerHTML = oneCountry;
}

function removeInfo() {
    countryDoc.innerHTML = '';
}






