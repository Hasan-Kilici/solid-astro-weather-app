import { createSignal, createEffect, onCleanup } from "solid-js";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    icon: string;
    description: string;
  }[];
}

function WeatherApp() {
  const [weatherData, setWeatherData] = createSignal<WeatherData | null>(null);
  const [city, setCity] = createSignal<string>("londra");
  const apiKey = import.meta.env.PUBLIC_ApiKey;

  createEffect(() => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}&q=${city()}&lang=tr`;

    const fetchWeatherData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Fetched Weather Data:", data);
        setWeatherData(prevData => ({
          ...data,
          weather: [{
            ...data.weather[0],
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
          }]
        }));
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  });

  onCleanup(() => {
    
  });

  const handleCityChange = (event: Event) => {
    const newCity = (event.target as HTMLInputElement).value;
    setCity(newCity);
  };

  return (
    <div>
      <div style="display:flex;justify-content:center;">
      <input
        class="search"
        id="cityInput"
        type="text"
        value={city()}
        onInput={handleCityChange}
      />
      </div>
      {weatherData() ? (
        <div style="display:flex;justify-content:center;">
          <div class="today">
            <div class="row" style="margin:-15px;">
              <img class="flag" src={`https://flag.muratoner.net/?country=${weatherData()!.sys.country}`} alt="Flag" />
              <h2>{weatherData()!.name}</h2>
            </div>
            <div class="row">
              <img class="icon" src={weatherData()!.weather[0].icon} alt="Weather Icon" />
              <p class="temp">
                {weatherData()!.main.temp}
                <b style="color:yellow">°C</b>
              </p>
            </div>
            <div class="today-footer" style="margin-top:25px">
              <div class="row" style="margin:0;gap:15px;justify-content:center;">
                <div>
                  <i class="fa-light fa-wind" style="margin-right:10px;"></i>{weatherData()!.wind.speed}
                </div>
                <div>
                  <i class="fa-regular fa-temperature-half" style="margin-right:10px;"></i>{weatherData()!.main.feels_like}
                </div>
                <div>
                  <i class="fa-regular fa-raindrops" style="margin-right:10px;"></i>{weatherData()!.main.humidity}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
}

export default WeatherApp;
