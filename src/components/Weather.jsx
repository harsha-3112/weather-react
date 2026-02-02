import React, { useEffect, useState } from "react";

const API_KEY = "3f7fffcd4de711d9be5073af363e7556";

const Weather = () => {
  const [city, setCity] = useState("Hyderabad");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [aqi, setAqi] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const currentData = await currentRes.json();
    setCurrent(currentData);


    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    const forecastData = await forecastRes.json();


    setHourly(forecastData.list.slice(0, 8));

    const daily = forecastData.list.filter((_, i) => i % 8 === 0);
    setForecast(daily);

    
    const { lat, lon } = currentData.coord;
    const aqiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const aqiData = await aqiRes.json();
    setAqi(aqiData.list[0].main.aqi);
  };

  const getAqiLabel = (aqi) => {
    return ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1];
  };

  return (
    <div className="container">
      <h2>🌍 Weather Dashboard</h2>

      <input value={city} onChange={(e) => setCity(e.target.value)} />
      <button onClick={fetchWeather}>Search</button>

      {current && (
        <div className="card">
          <h3>{current.name}</h3>
          <p> Temp: {current.main.temp}°C</p>
          <p> Pressure: {current.main.pressure} hPa</p>
          <p>Sunrise: {new Date(current.sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p> Sunset: {new Date(current.sys.sunset * 1000).toLocaleTimeString()}</p>
          <p> AQI: {aqi} ({getAqiLabel(aqi)})</p>
        </div>
      )}

      <h3>⏰ Today Hourly Temperature</h3>
      <div className="row">
        {hourly.map((h, i) => (
          <div key={i} className="mini-card">
            <p>{new Date(h.dt_txt).getHours()}:00</p>
            <p>{h.main.temp}°C</p>
          </div>
        ))}
      </div>

      <h3>📅 Next 5 Days Forecast</h3>
      <div className="row">
        {forecast.map((day, i) => (
          <div key={i} className="mini-card">
            <p>{new Date(day.dt_txt).toDateString()}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt=""
            />
            <p>{day.main.temp}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
