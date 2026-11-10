const fetchBtn = document.getElementById('fetchBtn');
const cityInput = document.getElementById('cityInput');
const weatherDiv = document.getElementById('weather');
const errorDiv = document.getElementById('error');

fetchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') getWeather();
});

function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    showError('Please enter a city name');
    return;
  }

  // Show loading
  weatherDiv.style.display = 'block';
  weatherDiv.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      Fetching weather...
    </div>
  `;
  errorDiv.textContent = '';

  // ---------- MOCK DATA (for learning) ----------
  // Simulating network delay
  setTimeout(() => {
    // Fake response based on city name
    const mockData = {
      city: city,
      country: "IN",
      temperature: (Math.random() * 15 + 25).toFixed(1), // 25-40°C
      feels_like: (Math.random() * 15 + 28).toFixed(1),
      humidity: Math.floor(Math.random() * 40 + 50),     // 50-90%
      description: ["Clear sky", "Partly cloudy", "Haze", "Light rain", "Sunny"][Math.floor(Math.random() * 5)],
      wind_speed: (Math.random() * 15 + 5).toFixed(1)
    };

    displayWeather(mockData);
  }, 1000); // 1 second delay to feel real
}

function displayWeather(data) {
  weatherDiv.innerHTML = `
    <div class="city-name">${data.city}, ${data.country}</div>
    <div class="temp">${Math.round(data.temperature)}°</div>
    <div class="description">${data.description}</div>

    <div class="details">
      <div class="detail-box">
        <div class="label">Feels Like</div>
        <div class="value">${Math.round(data.feels_like)}°C</div>
      </div>
      <div class="detail-box">
        <div class="label">Humidity</div>
        <div class="value">${data.humidity}%</div>
      </div>
      <div class="detail-box">
        <div class="label">Wind Speed</div>
        <div class="value">${data.wind_speed} km/h</div>
      </div>
      <div class="detail-box">
        <div class="label">Condition</div>
        <div class="value">${data.description}</div>
      </div>
    </div>
  `;
}

function showError(message) {
  errorDiv.textContent = message;
}