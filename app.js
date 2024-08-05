const express = require("express");
const path = require("path");
const cors = require('cors');
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(cors()); 

const PORT = process.env.PORT || 3000;

const openweather_api_key = "2b3e4489ced48cc3e85a02db1d626eb6";
const openweather_url = "https://api.openweathermap.org/data/2.5/weather";

const formatWeatherResponse = (data) => {
  return {
    location: data.name,
    temperature: (data.main.temp - 273.15).toFixed(2), 
    weather_descriptions: data.weather.map(w => w.description).join(", "),
    humidity: data.main.humidity,
    wind_speed: data.wind.speed,
  };
};

app.get("/weather", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    res.status(400).send("City parameter is required");
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
      res.status(404).send(weatherData.message);
    } else {
      const formattedWeatherData = formatWeatherResponse(weatherData);
      res.json(formattedWeatherData);
    }
  } catch (error) {
    res.status(500).send("Error fetching weather data");
  }
});


app.use(express.static(path.join(__dirname)));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;


