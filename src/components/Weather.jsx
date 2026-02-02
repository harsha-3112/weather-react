import React, {  useState } from "react";

const API_KEY = "3f7fffcd4de711d9be5073af363e7556";

function Weather() {
  const [city, setCity] = useState("");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [aqi, setAqi] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      setError("");

      // CURRENT WEATHER
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const currentData = await currentRes.json();

      if (currentData.cod !== 200) {
        setError("City not found");
        return;
      }

      setCurrent(currentData);

      // FORECAST
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      if (!forecastData.list) return;

      setHourly(forecastData.list.slice(0, 8));
      setForecast(forecastData.list.filter((_, i) => i % 8 === 0));

      // AQI
      const { lat, lon } = currentData.coord;
      const aqiRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const aqiData = await aqiRes.json();

      setAqi(aqiData?.list?.[0]?.main?.aqi);
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="container">
      <h2>🌦 Weather App</h2>

      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      <button onClick={fetchWeather}>Search</button>

      {error && <p style={{ color: "#ffcccc" }}>{error}</p>}

      {/* CURRENT WEATHER */}
      {current && (
        <div className="card">
          <h3>{current.name}</h3>
          <p>🌡 Temp: {current.main.temp}°C</p>
          <p>📊 Pressure: {current.main.pressure} hPa</p>
          <p>
            🌅 Sunrise:{" "}
            {new Date(current.sys.sunrise * 1000).toLocaleTimeString()}
          </p>
          <p>
            🌇 Sunset:{" "}
            {new Date(current.sys.sunset * 1000).toLocaleTimeString()}
          </p>
          {aqi && <p>🫁 AQI: {aqi}</p>}
        </div>
      )}

      {/* HOURLY */}
      {hourly.length > 0 && (
        <>
          <h3>⏰ Today Hourly</h3>
          <div className="row">
            {hourly.map((h, i) => (
              <div className="mini-card" key={i}>
                <p>{h.dt_txt.split(" ")[1].slice(0, 5)}</p>
                <p>{h.main.temp}°C</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* FORECAST */}
      {forecast.length > 0 && (
        <>
          <h3>📅 5 Day Forecast</h3>
          <div className="row">
            {forecast.map((day, i) => (
              <div className="mini-card" key={i}>
                <p>{new Date(day.dt_txt).toDateString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt=""
                />
                <p>{day.main.temp}°C</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Weather;
