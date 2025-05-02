const API_URL = 'https://restcountries.com/v3.1/all';

const countryListEl = document.getElementById('countryList');
const countryDetailEl = document.getElementById('countryDetail');
const closeDetailBtn = document.getElementById('closeDetail');
const searchInput = document.getElementById('searchInput');
const regionFilter = document.getElementById('regionFilter');

let countriesData = [];

async function fetchCountries() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    countriesData = data;
    renderCountryList(data);
  } catch (err) {
    console.error('Error fetching countries:', err);
  }
}

function renderCountryList(countries) {
  countryListEl.innerHTML = '';

  countries.forEach((country) => {
    const card = document.createElement('div');
    card.className = 'country-card';

    card.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common} 국기" />
      <h3>${country.name.common}</h3>
      <p>${country.region}</p>
      <p>👥 ${country.population.toLocaleString()}</p>
    `;

    card.addEventListener('click', () => {
      showCountryDetail(country);
    });

    countryListEl.appendChild(card);
  });
}

function showCountryDetail(country) {
  countryDetailEl.classList.remove('hidden');

  document.getElementById('detailFlag').src = country.flags.svg;
  document.getElementById('detailName').textContent = country.name.common;

  const infoList = document.getElementById('detailInfo');
  infoList.innerHTML = `
    <li><strong>공식 명칭:</strong> ${country.name.official}</li>
    <li><strong>수도:</strong> ${country.capital?.[0] || '없음'}</li>
    <li><strong>인구:</strong> ${country.population.toLocaleString()}</li>
    <li><strong>지역:</strong> ${country.region} / ${country.subregion}</li>
    <li><strong>통화:</strong> ${formatCurrencies(country.currencies)}</li>
    <li><strong>언어:</strong> ${formatLanguages(country.languages)}</li>
    <li><strong>시간대:</strong> ${country.timezones.join(', ')}</li>
    <li><a href="${country.maps.googleMaps}" target="_blank">📍 Google 지도에서 보기</a></li>
  `;

  const borderContainer = document.getElementById('borderCountries');
  borderContainer.innerHTML = '';
  if (country.borders) {
    country.borders.forEach((code) => {
      const btn = document.createElement('button');
      btn.textContent = code;
      btn.style.margin = '0.2rem';
      btn.onclick = () => {
        const neighbor = countriesData.find((c) => c.cca3 === code);
        if (neighbor) showCountryDetail(neighbor);
      };
      borderContainer.appendChild(btn);
    });
  }
}

searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = countriesData.filter((country) =>
    country.name.common.toLowerCase().includes(keyword)
  );
  renderCountryList(filtered);
});

regionFilter.addEventListener('change', () => {
  const region = regionFilter.value;
  const filtered = region
    ? countriesData.filter((c) => c.region === region)
    : countriesData;
  renderCountryList(filtered);
});

closeDetailBtn.addEventListener('click', () => {
  countryDetailEl.classList.add('hidden');
});

function formatLanguages(languagesObj) {
  if (!languagesObj) return '없음';
  return Object.values(languagesObj).join(', ');
}

function formatCurrencies(currenciesObj) {
  if (!currenciesObj) return '없음';
  return Object.values(currenciesObj)
    .map((cur) => `${cur.name} (${cur.symbol})`)
    .join(', ');
}

fetchCountries();
