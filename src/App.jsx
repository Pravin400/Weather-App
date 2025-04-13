import { useState } from 'react';
import './App.css';
import cloud from './assets/Cloud.svg';
import search from './assets/Search_icon.svg';
import cardBackground from './assets/card_background.jpg';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('C');

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'C' ? 'F' : 'C'));
  };

  const convertTemperature = (temp) => {
    return unit === 'C' ? temp : (temp * 9) / 5 + 32;
  };

  const sendReq = async () => {
    setLoading(true);
    const secret = import.meta.env.VITE_APP_SECRET;
    const Api = `https://api.weatherstack.com/current?access_key=${secret}&query=${city}`;

    try {
      const response = await fetch(Api);
      const data = await response.json();

      if (data.error) {
        setError('City not found!');
        setWeatherData(null);
      } else {
        setWeatherData({
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          icon: data.current.weather_icons[0],
          description: data.current.weather_descriptions[0],
          temperature: data.current.temperature,
          windSpeed: data.current.wind_speed,
          precip: data.current.precip,
          pressure: data.current.pressure,
        });
        setError('');
      }
    } catch (err) {
      setError('Failed to fetch weather data!');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="text-center py-4">
        <img src={cloud} alt="Cloud Icon" className="mx-auto w-16" />
        <h1 className="text-4xl font-bold">Weather App</h1>
        <p className="text-gray-400 mt-2">Get accurate weather updates</p>
      </div>

      <div className="relative flex justify-center my-8">
        <div className="relative w-[90%] max-w-md">
          <img
            src={search}
            alt="Search Icon"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 w-5 h-5"
          />
          <input
            id="entercity"
            className="pl-12 pr-4 py-2 rounded-2xl border-2 border-gray-600 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
            type="text"
            placeholder="Search location..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <button
          onClick={sendReq}
          className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Submit
        </button>
      </div>

      {loading && <p className="text-center text-gray-400">Loading...</p>}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {weatherData && (
        <div
          className="rounded-lg p-5 mx-auto w-[90%] max-w-md text-center  bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${cardBackground})` }}
        >
          <h2 className="text-2xl font-bold">{weatherData.name}</h2>
          <p className="text-gray-300">{weatherData.region}, {weatherData.country}</p>
          <div className="flex justify-center items-center my-4">
            <img src={weatherData.icon} alt="Weather Icon" className="w-16 h-16" />
            <p className="text-xl ml-4">{weatherData.description}</p>
          </div>
          <div className="flex justify-between text-lg mt-4">
            <div>
              <p className="font-semibold">Temperature</p>
              <p>{convertTemperature(weatherData.temperature)} °{unit}</p>
            </div>
            <div>
              <p className="font-semibold">Wind Speed</p>
              <p>{weatherData.windSpeed} m/s</p>
            </div>
          </div>
          <div className="flex justify-between text-lg mt-4">
            <div>
              <p className="font-semibold">Precipitation</p>
              <p>{weatherData.precip} mm</p>
            </div>
            <div>
              <p className="font-semibold">Pressure</p>
              <p>{weatherData.pressure} hPa</p>
            </div>
          </div>
          <button
            onClick={toggleUnit}
            className="mt-4 px-4 py-2 bg-black transition text-white rounded-lg hover:bg-gray-700"
          >
            Toggle to {unit === 'C' ? 'Fahrenheit' : 'Celsius'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
