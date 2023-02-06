import './css/styles.css';
import _debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { DEBOUNCE_DELAY, COUNTRIES_API } from './constants.js';

const countryList = document.getElementById('country-list');

const fetchCountries = txt => {
  if (!txt) {
    countryList.innerHTML = '';
    return;
  }
  fetch(COUNTRIES_API(txt))
    .then(response => {
      if (!response.ok) {
        countryList.innerHTML = `<h2>No country with that name</h2>`;
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else return response.json();
    })
    .then(countries => {
      if (countries.length > 1 && countries.length < 11) {
        const countriesArray = countries
          .map(
            item =>
              `<li><img style="width: 30px" src=${item.flags.svg} />${item.name.common}</li>`
          )
          .join('');
        countryList.innerHTML = countriesArray;
      } else if (countries.length === 1)
        countryList.innerHTML = `<h2>
        <img style="width: 60px" src=${countries[0].flags.svg} />
        ${countries[0].name.common}</h2>
      <p><b>Capital:</b> ${countries[0].capital}</p>
      <p><b>Population:</b> ${countries[0].population}</p>
      <p><b>Languages:</b> ${Object.values(countries[0].languages).join(
        ', '
      )}</p>
      `;
      else if (countries.length > 10) {
        countryList.innerHTML = ``;
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
      } else if (countries.length === 0)
        countryList.innerHTML = `<h2>Нет результатов</h2>`;
    })
    .catch(err => console.log('error'));
};

const fetchCountriesDebounced = _debounce(fetchCountries, DEBOUNCE_DELAY);

const searchBox = document.getElementById('search-box');
searchBox.addEventListener('input', function (e) {
  fetchCountriesDebounced(e.target.value);
});
