async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city');
        return;
    }

    try {
        const response = await fetch(`/weather?city=${city}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const weatherData = await response.json();
        displayWeather(weatherData);
    } catch (error) {
        document.getElementById('weather-info').innerHTML = `Error fetching weather data: ${error.message}`;
    }
}

function displayWeather(data) {
    const weatherInfo = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Location: ${data.location}</h5>
                <p class="card-text"><strong>Temperature:</strong> ${data.temperature} °C</p>
                <p class="card-text"><strong>Weather:</strong> ${data.weather_descriptions}</p>
                <p class="card-text"><strong>Humidity:</strong> ${data.humidity} %</p>
                <p class="card-text"><strong>Wind Speed:</strong> ${data.wind_speed} km/h</p>
            </div>
        </div>
    `;
    document.getElementById('weather-info').innerHTML = weatherInfo;
}

