const apiKey = "af8b32239e8f9cc5c845d9d1bdac45eb";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const historyDiv = document.getElementById("history");
const consoleOutput = document.getElementById("consoleOutput");


// Simple console logger
function log(message) {
    console.log(message);

    const div = document.createElement("div");
    div.innerText = message;
    consoleOutput.appendChild(div);
}


// Save search history
function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem("history", JSON.stringify(history));
    }

    showHistory();
}


// Show search history
function showHistory() {
    historyDiv.innerHTML = "";

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.forEach(city => {
        const span = document.createElement("span");
        span.innerText = city;

        span.addEventListener("click", function () {
            fetchWeather(city);
        });

        historyDiv.appendChild(span);
    });
}


// Display weather data
function displayWeather(data) {
    weatherInfo.innerHTML = `
        <div class="weather-row">
            <span>City</span>
            <span>${data.name}</span>
        </div>

        <div class="weather-row">
            <span>Temperature</span>
            <span>${data.main.temp} °C</span>
        </div>

        <div class="weather-row">
            <span>Weather</span>
            <span>${data.weather[0].main}</span>
        </div>

        <div class="weather-row">
            <span>Humidity</span>
            <span>${data.main.humidity}%</span>
        </div>

        <div class="weather-row">
            <span>Wind Speed</span>
            <span>${data.wind.speed} m/s</span>
        </div>
    `;
}


// Show error
function showError(message) {
    weatherInfo.innerHTML = `<div class="error">${message}</div>`;
}


// Fetch weather using async/await
async function fetchWeather(city) {

    log("Fetching weather data...");

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        const data = await response.json();

        // Check API error inside JSON
        if (data.cod !== 200) {
            showError(data.message);
            return;
        }

        displayWeather(data);
        saveHistory(city);

        log("Weather data loaded successfully");

    } catch (error) {
        showError("Unable to fetch data. Please try again.");
        log("Error: " + error.message);
    }
}


// Button click event
searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name");
        return;
    }

    fetchWeather(city);
});


// Enter key support
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});


// Load history on page load
showHistory();


// Event loop demo
log("Script started");

setTimeout(function () {
    log("setTimeout executed");
}, 0);

Promise.resolve().then(function () {
    log("Promise resolved");
});

log("Script finished");
