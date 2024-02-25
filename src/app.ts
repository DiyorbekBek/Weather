function getWeather() {
  const apiKey = "96b947a45d33d7dc1c49af3203966408";
  const city = document.getElementById("city").value as HTMLInputElement;

  if (!city) {
    alert("Please enter a city");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      alert("Error fetching current weather data. Please try again.");
    });

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list);
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error);
      alert("Error fetching hourly forecast data. Please try again.");
    });
}

interface WeatherData {
  cod: string;
  message?: string;
  name?: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

function displayWeather(data: WeatherData): void {
  const tempDivInfo: HTMLElement | null = document.getElementById("temp-div");
  const weatherInfoDiv: HTMLElement | null =
    document.getElementById("weather-info");
  const weatherIcon: HTMLImageElement | null = document.getElementById(
    "weather-icon"
  ) as HTMLImageElement;
  const hourlyForecastDiv: HTMLElement | null =
    document.getElementById("hourly-forecast");

  if (tempDivInfo && weatherInfoDiv && weatherIcon && hourlyForecastDiv) {
    weatherInfoDiv.innerHTML = "";
    hourlyForecastDiv.innerHTML = "";
    tempDivInfo.innerHTML = "";

    if (data.cod === "404") {
      weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
      const cityName: string = data.name || "";
      const temperature: number = Math.round(data.main.temp - 273.15); // Convert to Celsius
      const description: string = data.weather[0].description;
      const iconCode: string = data.weather[0].icon;
      const iconUrl: string = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

      const temperatureHTML: string = `
          <p>${temperature}°C</p>
        `;

      const weatherHtml: string = `
          <p>${cityName}</p>
          <p>${description}</p>
        `;

      tempDivInfo.innerHTML = temperatureHTML;
      weatherInfoDiv.innerHTML = weatherHtml;
      weatherIcon.src = iconUrl;
      weatherIcon.alt = description;

      showImage();
    }
  } else {
    console.error("One or more DOM elements not found");
  }
}

interface HourlyDataItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
  }[];
}

function displayHourlyForecast(hourlyData: HourlyDataItem[]): void {
  const hourlyForecastDiv: HTMLElement | null =
    document.getElementById("hourly-forecast");

  if (hourlyForecastDiv) {
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach((item: HourlyDataItem) => {
      const dateTime = new Date(item.dt * 1000);
      const hour: number = dateTime.getHours();
      const temperature: number = Math.round(item.main.temp - 273.15);
      const iconCode: string = item.weather[0].icon;
      const iconUrl: string = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const hourlyItemHtml: string = `
          <div class="hourly-item">
            <span>${hour}:00</span>
            <img src="${iconUrl}" alt="Hourly Weather Icon">
            <span>${temperature}°C</span>
          </div>
        `;

      if (hourlyForecastDiv) {
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
      } else {
        console.error("Hourly forecast container not found");
      }
    });
  } else {
    console.error("Hourly forecast container not found");
  }
}

function showImage(): void {
  const weatherIcon: HTMLElement | null =
    document.getElementById("weather-icon");
  if (weatherIcon) {
    weatherIcon.style.display = "block";
  } else {
    console.error("Weather icon element not found");
  }
}
