const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Get free key from openweathermap.org
const BASE_URL = 'https://api.openweathermap.org';

let currentUnit = 'metric'; // metric for Celsius, imperial for Fahrenheit
let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
let currentWeatherData = null;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const unitToggle = document.getElementById('unitToggle');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const currentWeatherSection = document.getElementById('currentWeather');
const hourlySection = document.getElementById('hourlySection');
const weeklySection = document.getElementById('weeklySection');
const suggestionsList = document.getElementById('suggestionsList');

// Event Listeners
searchBtn.addEventListener('click', () => searchCity(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCity(searchInput.value);
});
searchInput.addEventListener('input', (e) => showSuggestions(e.target.value));
locationBtn.addEventListener('click', getCurrentLocationWeather);
unitToggle.addEventListener('click', toggleUnit);

// Initialize
loadFavorites();
getCurrentLocationWeather();

// Search City
async function searchCity(city) {
    if (!city.trim()) return;
    await fetchWeatherData(city);
    searchInput.value = '';
    suggestionsList.classList.add('hidden');
}

// Show Suggestions
async function showSuggestions(city) {
    if (!city.trim()) {
        suggestionsList.classList.add('hidden');
        return;
    }

    try {
        const response = await fetch(
            `${BASE_URL}/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        
        suggestionsList.innerHTML = '';
        data.forEach(location => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = `${location.name}, ${location.country}`;
            div.addEventListener('click', () => {
                searchCity(location.name);
            });
            suggestionsList.appendChild(div);
        });
        suggestionsList.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

// Fetch Weather Data
async function fetchWeatherData(city) {
    showLoading(true);
    hideError();

    try {
        // Get coordinates
        const geoResponse = await fetch(
            `${BASE_URL}/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoResponse.json();

        if (!geoData.length) {
            showError('City not found');
            showLoading(false);
            return;
        }

        const { lat, lon, name } = geoData[0];

        // Get weather data
        const weatherResponse = await fetch(
            `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`
        );
        const weatherData = await weatherResponse.json();

        // Get forecast data
        const forecastResponse = await fetch(
            `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();

        // Get UV Index
        const uvResponse = await fetch(
            `${BASE_URL}/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const uvData = await uvResponse.json();

        currentWeatherData = { ...weatherData, uvIndex: uvData.value };
        displayCurrentWeather(weatherData, uvData.value);
        displayForecast(forecastData);

        showLoading(false);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Failed to fetch weather data');
        showLoading(false);
    }
}

// Get Current Location Weather
function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        showError('Geolocation not supported');
        return;
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
            showError('Unable to access location');
            showLoading(false);
        }
    );
}

async function fetchWeatherByCoordinates(lat, lon) {
    try {
        const weatherResponse = await fetch(
            `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`
        );
        const weatherData = await weatherResponse.json();

        const forecastResponse = await fetch(
            `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();

        const uvResponse = await fetch(
            `${BASE_URL}/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const uvData = await uvResponse.json();

        currentWeatherData = { ...weatherData, uvIndex: uvData.value };
        displayCurrentWeather(weatherData, uvData.value);
        displayForecast(forecastData);

        showLoading(false);
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to fetch weather');
        showLoading(false);
    }
}

// Display Current Weather
function displayCurrentWeather(data, uvIndex) {
    const unit = currentUnit === 'metric' ? '°C' : '°F';
    const windUnit = currentUnit === 'metric' ? 'm/s' : 'mph';

    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('weatherDate').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}${unit}`;
    document.getElementById('weatherDescription').textContent = data.weather[0].main;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed)} ${windUnit}`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}${unit}`;
    document.getElementById('uvIndex').textContent = uvIndex.toFixed(1);

    currentWeatherSection.classList.remove('hidden');
}

// Display Forecast
function displayForecast(data) {
    const hourlyData = data.list.slice(0, 8);
    const dailyData = {};

    // Group data by day
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = item;
        }
    });

    // Display Hourly
    const hourlyHtml = hourlyData.map(item => `
        <div class="hourly-item">
            <p>${new Date(item.dt * 1000).getHours()}:00</p>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather">
            <span class="temp">${Math.round(item.main.temp)}°</span>
        </div>
    `).join('');
    document.getElementById('hourlyForecast').innerHTML = hourlyHtml;
    hourlySection.classList.remove('hidden');

    // Display Weekly
    const weeklyHtml = Object.values(dailyData).slice(0, 7).map(item => `
        <div class="daily-item">
            <div class="day">${new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather">
            <div class="temp-range">
                <span class="high">${Math.round(item.main.temp_max)}°</span>
                <span class="low">${Math.round(item.main.temp_min)}°</span>
            </div>
            <div class="description">${item.weather[0].main}</div>
        </div>
    `).join('');
    document.getElementById('weeklyForecast').innerHTML = weeklyHtml;
    weeklySection.classList.remove('hidden');
}

// Toggle Temperature Unit
function toggleUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    unitToggle.textContent = currentUnit === 'metric' ? '°C' : '°F';
    
    if (currentWeatherData) {
        fetchWeatherByCoordinates(currentWeatherData.coord.lat, currentWeatherData.coord.lon);
    }
}

// Load Favorites
function loadFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p style="color: #999; text-align: center;">No favorites yet</p>';
        return;
    }

    favoritesList.innerHTML = favorites.map(city => `
        <div class="favorite-item" onclick="searchCity('${city}')">
            <button class="remove-btn" onclick="removeFavorite(event, '${city}')" title="Remove">
                <i class="fas fa-times"></i>
            </button>
            <div class="city-name">${city}</div>
            <div class="temp">-</div>
        </div>
    `).join('');
}

// Add Favorite
function addFavorite() {
    if (currentWeatherData && !favorites.includes(currentWeatherData.name)) {
        favorites.push(currentWeatherData.name);
        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
        loadFavorites();
    }
}

// Remove Favorite
function removeFavorite(e, city) {
    e.stopPropagation();
    favorites = favorites.filter(c => c !== city);
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
    loadFavorites();
}

// Helper Functions
function showLoading(show) {
    loading.classList.toggle('hidden', !show);
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (e.target !== searchInput) {
        suggestionsList.classList.add('hidden');
    }
});