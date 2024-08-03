class WeatherUtils{
    static currentDayWeatherDataFormatter(data){
        return {
            temperature: Math.round(data.temperature).toString() + ' °C',
            humidity: data.humidity + '%',
            weatherCode: WeatherUtils.getWeatherDescription(data.weatherCode),
            windSpeed: Math.round(data.windSpeed).toString() + ' km/h',
            windDirection: WeatherUtils.getWindDirection(data.windDirection),
            visibility: (data.visibility / 1000).toString() + ' km',
            maxTemperature: Math.round(data.maxTemperature).toString() + ' °C',
            minTemperature: Math.round(data.minTemperature).toString() + ' °C',
            precipitationSum: Math.round(data.precipitationSum).toString() + ' mm',
            precipitationProbabilityMax: data.precipitationProbabilityMax.toString() + '%',
            uvIndexMax: Math.round(data.uvIndexMax).toString()
        };
    }

    static todayHourlyWeatherDataFormatter(data){
        const formattedWeather = {};

        // Format temperature2m
        formattedWeather.temperature2m = Object.fromEntries(
            Object.entries(data.temperature2m).map(([key, value]) => [key, Math.round(value) + '℃'])
        );
    
        // Format precipitationProbability
        formattedWeather.precipitationProbability = Object.fromEntries(
            Object.entries(data.precipitationProbability).map(([key, value]) => [key, value + '%'])
        );
    
        // Format precipitation
        formattedWeather.precipitation = Object.fromEntries(
            Object.entries(data.precipitation).map(([key, value]) => [key, value + ' mm'])
        );
    
        return formattedWeather;
    }

    static dailyWeatherDataFormatter(data){
        const result = [];

        for (let i = 0; i < 7; i++) {
            const date = WeatherUtils.formatDate(data.time[i]);
            const dayOfWeek = WeatherUtils.getDayOfWeek(data.time[i]);
            const weatherCode = WeatherUtils.getWeatherDescription(data.weatherCode[i]);
            const temperature2mMax = Math.round(data.temperature2mMax[i]).toString() + '℃';
            const temperature2mMin = Math.round(data.temperature2mMin[i]).toString() + '℃';
            const precipitationSum = Math.round(data.precipitationSum[i]).toString() + 'mm';
            const precipitationProbabilityMax = data.precipitationProbabilityMax[i].toString() + '%';
    
            result.push({
                date,
                dayOfWeek,
                weatherCode,
                temperature2mMax,
                temperature2mMin,
                precipitationSum,
                precipitationProbabilityMax
            });
        }
    
        return result;
    }

    static getWeatherDescription(code) {
        const weatherCodes = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Drizzle: Light intensity",
            53: "Drizzle: Moderate intensity",
            55: "Drizzle: Dense intensity",
            56: "Freezing Drizzle: Light intensity",
            57: "Freezing Drizzle: Dense intensity",
            61: "Rain: Slight intensity",
            63: "Rain: Moderate intensity",
            65: "Rain: Heavy intensity",
            66: "Freezing Rain: Light intensity",
            67: "Freezing Rain: Heavy intensity",
            71: "Snow fall: Slight intensity",
            73: "Snow fall: Moderate intensity",
            75: "Snow fall: Heavy intensity",
            77: "Snow grains",
            80: "Rain showers: Slight intensity",
            81: "Rain showers: Moderate intensity",
            82: "Rain showers: Violent intensity",
            85: "Snow showers: Slight intensity",
            86: "Snow showers: Heavy intensity",
            95: "Thunderstorm: Slight or moderate",
            96: "Thunderstorm with slight hail",
            99: "Thunderstorm with heavy hail"
        };
    
        return weatherCodes[code] || "Unknown weather code";
    }

    static getWindDirection(degrees) {
        if (degrees >= 0 && degrees <= 22.5 || degrees > 337.5 && degrees <= 360) {
            return 'N';
        } else if (degrees > 22.5 && degrees <= 67.5) {
            return 'NE';
        } else if (degrees > 67.5 && degrees <= 112.5) {
            return 'E';
        } else if (degrees > 112.5 && degrees <= 157.5) {
            return 'SE';
        } else if (degrees > 157.5 && degrees <= 202.5) {
            return 'S';
        } else if (degrees > 202.5 && degrees <= 247.5) {
            return 'SW';
        } else if (degrees > 247.5 && degrees <= 292.5) {
            return 'W';
        } else if (degrees > 292.5 && degrees <= 337.5) {
            return 'NW';
        } else {
            return 'Invalid degree';
        }
    }

    static formatDate (dateString) {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric' };
        const day = date.toLocaleDateString('en-US', options);
        const suffix = (date.getDate() % 10 === 1 && date.getDate() !== 11) ? 'st' :
                       (date.getDate() % 10 === 2 && date.getDate() !== 12) ? 'nd' :
                       (date.getDate() % 10 === 3 && date.getDate() !== 13) ? 'rd' : 'th';
        return day + suffix;
    };

    static getDayOfWeek (dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long' };
        return date.toLocaleDateString('en-US', options);
    };
}

module.exports = {
    WeatherUtils
}