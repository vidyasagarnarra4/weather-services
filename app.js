const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');

app.use(express.static(path.join(__dirname)));

const openweather_api_key = '2b3e4489ced48cc3e85a02db1d626eb6';
const openweather_url = 'http://api.openweathermap.org/data/2.5/weather';


const formatWeatherResponse = (data) => {
  return {
    location: data.name,
    temperature: (data.main.temp - 273.15).toFixed(2), 
    weather_descriptions: data.weather.map(w => w.description).join(', '),
    humidity: data.main.humidity,
    wind_speed: data.wind.speed,
  };
};


app.get('/weather', async (request, response) => {
  const { city } = request.query;

  if (!city) {
    response.status(400).send('City parameter is required');
    return;
  }

  try {
    const weatherResponse = await axios.get(openweather_url, {
      params: {
        q: city,
        appid: openweather_api_key,
      },
    });

    const weatherData = weatherResponse.data;

    if (weatherData.cod && weatherData.cod !== 200) {
      response.status(404).send(weatherData.message);
    } else {
      const formattedWeatherData = formatWeatherResponse(weatherData);
      response.send(formattedWeatherData);
    }
  } catch (error) {
    response.status(500).send('Error fetching weather data');
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); 
});

// Start server
const initializeServer = async () => {
  try {
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000');
    });
  } catch (error) {
    console.log(`Server Error: ${error.message}`);
    process.exit(1);
  }
};

initializeServer();


