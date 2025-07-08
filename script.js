const apiKey = "a4135a1fe9a34c279f193250250807";
const apiUrl = "https://api.weatherapi.com/v1/forecast.json";


document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const menuToggle = document.getElementById("menu-toggle");
  const navSider = document.getElementById("navSider");
  const weatherDisplay = document.getElementById("weather-display");

  if (window.innerWidth <= 768) {
    navSider.style.display = "none";
  }

  menuToggle.addEventListener("click", () => {
    navSider.classList.toggle("active");
  });

  searchBtn.addEventListener("click", () => {
    const location = searchInput.value;
    if (location) {
      fetchWeather(location);
    } else {
      alert("Please enter a location!");
    }
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });

  function fetchWeather(location) {
    fetch(`${apiUrl}?key=${apiKey}&q=${location}&days=7&aqi=yes`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        displayWeather(data);

        predictRain(data.current.precip_mm);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        weatherDisplay.innerHTML = `<p class="placeholder-text">Could not retrieve weather for "${location}". Please try again.</p>`;
      });
  }

  function displayWeather(data) {
    const weatherDisplay = document.getElementById("weather-display");
    const forecastHTML = data.forecast.forecastday
      .map((day) => {
        const date = new Date(day.date);
        const dayOfWeek = date.toLocaleDateString("en-US", {
          weekday: "short",
        });
        return `
        <div class="forecast-item">
          <img src="http:${day.day.condition.icon}" alt="${day.day.condition.text}">
          ${dayOfWeek}<br>${day.day.avgtemp_c}°C
        </div>
      `;
      })
      .join("");

    weatherDisplay.innerHTML = `
      <div class="weather-header">
        <img src="http:${data.current.condition.icon}" alt="Weather icon">
        <div>
          <h2>${data.current.temp_c}°C</h2>
          <div class="weather-details">
            Location: ${data.location.name}, ${data.location.region}, ${data.location.country}<br>
            Condition: ${data.current.condition.text}<br>
            Precipitation: ${data.current.precip_mm} mm | Humidity: ${data.current.humidity}% | Wind: ${data.current.wind_kph} km/h
          </div>
        </div>
      </div>
      <div class="weather-graph">
        </div>
      <div class="forecast">
        ${forecastHTML}
      </div>
    `;
  }

  function predictRain(precipitation) {
    const weatherDisplay = document.getElementById("weather-display");
    const existingPrediction = weatherDisplay.querySelector(".rain-prediction");
    if (existingPrediction) {
      existingPrediction.remove();
    }
    const rainPrediction = document.createElement("div");
    rainPrediction.className = "rain-prediction";
    ("");
    rainPrediction.textContent =
      precipitation > 0 ? "It might rain today!" : "It will not rain today.";
    weatherDisplay.appendChild(rainPrediction);
  }
});
