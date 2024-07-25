const { fetchWeatherApi } = require('openmeteo');

const params = {
    "latitude": 43.4794,
    "longitude": -80.5176,
    "hourly": ["temperature_2m", "relative_humidity_2m", "precipitation_probability", "precipitation", "weather_code", "pressure_msl", "surface_pressure", "visibility", "wind_speed_10m", "temperature_80m"],
    "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "precipitation_sum"]
};
const url = "https://api.open-meteo.com/v1/forecast";

// Helper function to form time ranges
const range = (start, stop, step) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// Using an async function to handle async/await
async function fetchAndProcessWeather() {
    try {
        const responses = await fetchWeatherApi(url, params); // Wait for the fetchWeatherApi to complete

        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();

        const hourly = response.hourly();
        const daily = response.daily();

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2m: hourly.variables(0).valuesArray(),
                relativeHumidity2m: hourly.variables(1).valuesArray(),
                precipitationProbability: hourly.variables(2).valuesArray(),
                precipitation: hourly.variables(3).valuesArray(),
                weatherCode: hourly.variables(4).valuesArray(),
                pressureMsl: hourly.variables(5).valuesArray(),
                surfacePressure: hourly.variables(6).valuesArray(),
                visibility: hourly.variables(7).valuesArray(),
                windSpeed10m: hourly.variables(8).valuesArray(),
                temperature80m: hourly.variables(9).valuesArray(),
            },
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                weatherCode: daily.variables(0).valuesArray(),
                temperature2mMax: daily.variables(1).valuesArray(),
                temperature2mMin: daily.variables(2).valuesArray(),
                sunrise: daily.variables(3).valuesArray(),
                sunset: daily.variables(4).valuesArray(),
                precipitationSum: daily.variables(5).valuesArray(),
            },
        };

        // `weatherData` now contains a simple structure with arrays for datetime and weather data
        // for (let i = 0; i < weatherData.hourly.time.length; i++) {
        //     console.log(
        //         weatherData.hourly.time[i].toISOString(),
        //         weatherData.hourly.temperature2m[i],
        //         weatherData.hourly.relativeHumidity2m[i],
        //         weatherData.hourly.precipitationProbability[i],
        //         weatherData.hourly.precipitation[i],
        //         weatherData.hourly.weatherCode[i],
        //         weatherData.hourly.pressureMsl[i],
        //         weatherData.hourly.surfacePressure[i],
        //         weatherData.hourly.visibility[i],
        //         weatherData.hourly.windSpeed10m[i],
        //         weatherData.hourly.temperature80m[i]
        //     );
        // }
        for (let i = 0; i < weatherData.daily.time.length; i++) {
            console.log(
                weatherData.daily.time[i].toISOString(),
                weatherData.daily.weatherCode[i],
                weatherData.daily.temperature2mMax[i],
                weatherData.daily.temperature2mMin[i],
                weatherData.daily.sunrise,
                weatherData.daily.sunset,
                weatherData.daily.precipitationSum[i]
            );
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Call the async function
fetchAndProcessWeather();