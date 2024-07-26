const { fetchWeatherApi } = require('openmeteo');

class WeatherServices {
    static getTodayWeatherData() {
        return new Promise(async (resolve, reject) => {
            // 配置
            const url = "https://api.open-meteo.com/v1/forecast";
            const range = (start, stop, step) =>
                Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
            const params = {
                // 经纬度
                "latitude": 43.47,
                "longitude": -80.51,
                "current": ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m", "wind_direction_10m"],
                "hourly": "visibility",
                "daily":[ "uv_index_max", "temperature_2m_max", "temperature_2m_min", "precipitation_sum", "precipitation_probability_max"],
                "timezone": "America/New_York",
                "forecast_days": 1
            };

            // API calling
            try {
                const responses = await fetchWeatherApi(url, params); // Wait for the fetchWeatherApi to complete
                // Process first location. Add a for-loop for multiple locations or weather models
                const response = responses[0];
                const utcOffsetSeconds = response.utcOffsetSeconds();

                const current = response.current();
                const hourly = response.hourly();
                const daily = response.daily();

                const weatherData = {
                    current: {
                        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                        temperature2m: current.variables(0).value(),
                        relativeHumidity2m: current.variables(1).value(),
                        weatherCode: current.variables(2).value(),
                        windSpeed10m: current.variables(3).value(),
                        windDirection10m: current.variables(4).value(),
                    },
                    hourly: {
                        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                            (t) => new Date((t + utcOffsetSeconds) * 1000)
                        ),
                        visibility: hourly.variables(0).valuesArray(),
                    },
                    daily: {
                        time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                            (t) => new Date((t + utcOffsetSeconds) * 1000)
                        ),
                        uvIndexMax: daily.variables(0).valuesArray(),
                        maxTemperature: daily.variables(1).valuesArray(), // temperature_2m_max
                        minTemperature: daily.variables(2).valuesArray(), // temperature_2m_min
                        precipitationSum: daily.variables(3).valuesArray(), // precipitation_sum
                        precipitationProbabilityMax: daily.variables(4).valuesArray(), // precipitation_probability_max
                    },
                }

                // 获取当前时间
                const now = new Date();

                // 获取当前小时数
                const currentHour = now.getHours();
                
                // console.log(
                //     '时间：' + weatherData.current.time.toISOString() + '\n',
                //     '温度：' + weatherData.current.temperature2m + '\n',
                //     "湿度：" + weatherData.current.relativeHumidity2m + '\n',
                //     "天气状况：" + weatherData.current.weatherCode + '\n',
                //     "风速：" + weatherData.current.windSpeed10m + '\n',
                //     "风向：" + weatherData.current.windDirection10m + '\n',
                //     "能见度：" + weatherData.hourly.visibility[currentHour] + '\n',
                //     "最高温度：" + weatherData.daily.maxTemperature[0] + '\n',
                //     "最低温度：" + weatherData.daily.minTemperature[0] + '\n',
                //     "降水总量：" + weatherData.daily.precipitationSum[0] + '\n',
                //     "最大降水概率：" + weatherData.daily.precipitationProbabilityMax[0] + '\n',
                //     "UV指数：" + weatherData.daily.uvIndexMax[0] 
                // )

                const finalWeatherData = {
                    time : weatherData.current.time.toISOString(),
                    temperature : weatherData.current.temperature2m, 
                    humidity : weatherData.current.relativeHumidity2m,
                    weatherCode : weatherData.current.weatherCode, 
                    windSpeed : weatherData.current.windSpeed10m,
                    windDirection : weatherData.current.windDirection10m,
                    visibility : weatherData.hourly.visibility[currentHour],
                    maxTemperature : weatherData.daily.maxTemperature[0],
                    minTemperature : weatherData.daily.minTemperature[0],
                    precipitationSum : weatherData.daily.precipitationSum[0],
                    precipitationProbabilityMax : weatherData.daily.precipitationProbabilityMax[0],
                    uvIndexMax : weatherData.daily.uvIndexMax[0],
                }

                resolve({ data : finalWeatherData })
            } catch (error) {
                reject(error);
            }
        });
    }

    static getIn7DaysDailyWeatherData() {
        return new Promise(async (resolve, reject) => {
            // 配置
            const url = "https://api.open-meteo.com/v1/forecast";
            const range = (start, stop, step) =>
                Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
            const params = {
                // 经纬度
                "latitude": 43.47,
                "longitude": -80.51,
                "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "precipitation_sum", "precipitation_probability_max"],
                "timezone": "America/New_York",
                "forecast_days": 7
            };

            // API calling
            try {
                const responses = await fetchWeatherApi(url, params); // Wait for the fetchWeatherApi to complete
                // Process first location. Add a for-loop for multiple locations or weather models
                const response = responses[0];
                const utcOffsetSeconds = response.utcOffsetSeconds();

                const daily = response.daily();

                const weatherData = {
                    daily: {
                        time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                            (t) => new Date((t + utcOffsetSeconds) * 1000)
                        ),
                        weatherCode: daily.variables(0).valuesArray(),
                        temperature2mMax: daily.variables(1).valuesArray(),
                        temperature2mMin: daily.variables(2).valuesArray(),
                        precipitationSum: daily.variables(3).valuesArray(),
                        precipitationProbabilityMax: daily.variables(4).valuesArray(),
                    },
                }

                // for (let i = 0; i < weatherData.daily.time.length; i++) {
                //     console.log(
                //         '时间：' + weatherData.daily.time[i].toISOString(),
                //         '天气：' + weatherData.daily.weatherCode[i],
                //         '最大温度：' + weatherData.daily.temperature2mMax[i],
                //         '最小温度：' + weatherData.daily.temperature2mMin[i],
                //         '降水总量：' + weatherData.daily.precipitationSum[i],
                //         '最大降水概率：' + weatherData.daily.precipitationProbabilityMax[i]
                //     );
                // }
                // 时间：2024-07-25T00:00:00.000Z 天气：1 最大温度：23.019500732421875 最小温度：13.769499778747559 降水总量：0 最大降水概率：26
                // 时间：2024-07-26T00:00:00.000Z 天气：1 最大温度：26.3695011138916 最小温度：11.419499397277832 降水总量：0 最大降水概率：0
                // 时间：2024-07-27T00:00:00.000Z 天气：3 最大温度：27.41950035095215 最小温度：12.819499969482422 降水总量：0 最大降水概率：0
                // 时间：2024-07-28T00:00:00.000Z 天气：3 最大温度：27.079999923706055 最小温度：14.779999732971191 降水总量：0 最大降水概率：6
                // 时间：2024-07-29T00:00:00.000Z 天气：80 最大温度：27.579999923706055 最小温度：17.779998779296875 降水总量：6.800000190734863 最大降水概率：65
                // 时间：2024-07-30T00:00:00.000Z 天气：55 最大温度：26.67999839782715 最小温度：19.17999839782715 降水总量：2.0999999046325684 最大降水概率：74
                // 时间：2024-07-31T00:00:00.000Z 天气：3 最大温度：24.829999923706055 最小温度：17.979999542236328 降水总量：0 最大降水概率：47

                const finalWeatherData = {
                    time : weatherData.daily.time,
                    weatherCode: weatherData.daily.weatherCode,
                    temperature2mMax: weatherData.daily.temperature2mMax,
                    temperature2mMin: weatherData.daily.temperature2mMin,
                    precipitationSum: weatherData.daily.precipitationSum,
                    precipitationProbabilityMax: weatherData.daily.precipitationProbabilityMax,
                }

                resolve({ data : finalWeatherData })
            } catch (error) {
                reject(error);
            }
        })
    }

    static getTodayHourlyWeatherData() {
        return new Promise(async (resolve, reject) => {
            // 配置
            const url = "https://api.open-meteo.com/v1/forecast";
            const range = (start, stop, step) =>
                Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
            const params = {
                "latitude": 43.47,
                "longitude": -80.51,
                "hourly": ["temperature_2m", "precipitation_probability", "precipitation"],
                "timezone": "America/New_York",
                "forecast_days": 1
            };
            // API calling
            try {
                const responses = await fetchWeatherApi(url, params); // Wait for the fetchWeatherApi to complete
                // Process first location. Add a for-loop for multiple locations or weather models
                const response = responses[0];
                const utcOffsetSeconds = response.utcOffsetSeconds();

                const hourly = response.hourly();

                const weatherData = {
                    hourly: {
                        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                            (t) => new Date((t + utcOffsetSeconds) * 1000)
                        ),
                        temperature2m: hourly.variables(0).valuesArray(),
                        precipitationProbability: hourly.variables(1).valuesArray(),
                        precipitation: hourly.variables(2).valuesArray(),
                    },
                }

                const finalWeatherData = {
                    time : weatherData.hourly.time,
                    temperature2m: weatherData.hourly.temperature2m,
                    precipitationProbability: weatherData.hourly.precipitationProbability,
                    precipitation: weatherData.hourly.precipitation
                }

                resolve({ data : finalWeatherData })
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = WeatherServices;