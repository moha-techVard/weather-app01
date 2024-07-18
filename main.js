document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("button");
  const APIkey = "e8e7dfb29cb280a65590ba5f70092341";
  const currentWeatherApi =
    "https://api.openweathermap.org/data/2.5/weather?q=";
  const forecastApi = "https://api.openweathermap.org/data/2.5/forecast?q=";

  button.addEventListener("click", (event) => {
    event.preventDefault(); // Empêcher le comportement par défaut du formulaire
    document.querySelector(".block2").style.display = "block";
    document.querySelector(".block3").style.opacity = "1";
    document.querySelector(".video-background").style.display = "block";
    getCurrentWeather();
    getForecast();
  });

  async function getCurrentWeather() {
    const city = document.getElementById("city").value.trim();
    if (!city) {
      alert("Please enter a city name.");
      return;
    }
    try {
      const response = await fetch(
        `${currentWeatherApi}${city}&units=metric&appid=${APIkey}`
      );
      if (!response.ok) {
        throw new Error("Erreur réseau : " + response.statusText);
      }
      const data = await response.json();
      console.log(data);
      displayCurrentWeather(data);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Could not retrieve current weather data. Please try again later.");
    }
  }

  function displayCurrentWeather(data) {
    const h1 = document.querySelector("h1");
    const h2 = document.querySelector(".cityName");
    const p1 = document.getElementById("p1");
    const p2 = document.getElementById("p2");
    const img = document.getElementById("img");
    const video = document.getElementById("background-video");

    h1.innerHTML = data.name;
    h2.innerHTML = data.main.temp + "°C";
    p1.innerHTML = data.main.humidity + "%";
    p2.innerHTML = data.wind.speed + " m/s";

    const weatherCondition = data.weather[0].main.toLowerCase();

    if (weatherCondition === "clouds") {
      img.src = "/img/Draw_cloudy.png";
      video.src = "/img/istockphoto-clouds_adpp_is.mp4";
    } else if (weatherCondition === "rain") {
      img.src = "/img/raining.weather.webp";
      video.src = "/img/istockphoto-1346376819-640_adpp_is.mp4";
    } else if (weatherCondition === "clear") {
      img.src = "/img/sunny.weather.png";
      video.src = "/img/istockphoto-sunny_adpp_is.mp4";
    } else {
      img.src = "/img/default.weather.png"; // Image par défaut si la condition ne correspond à aucune des autres
    }
  }

  async function getForecast() {
    const city = document.getElementById("city").value.trim();
    if (!city) {
      alert("Please enter a city name.");
      return;
    }
    try {
      const response = await fetch(
        `${forecastApi}${city}&units=metric&cnt=14&appid=${APIkey}`
      );
      if (!response.ok) {
        throw new Error("Erreur réseau : " + response.statusText);
      }
      const data = await response.json();
      displayForecast(data);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Could not retrieve forecast data. Please try again later.");
    }
  }

  function displayForecast(data) {
    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = ""; // Efface le contenu précédent

    const days = {};

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });
      if (!days[day]) {
        days[day] = { temp: item.main.temp, count: 1 };
      } else {
        days[day].temp += item.main.temp;
        days[day].count++;
      }
    });

    Object.keys(days).forEach((day) => {
      const avgTemp = (days[day].temp / days[day].count).toFixed(1);

      const forecastItem = document.createElement("div");
      forecastItem.classList.add("forecast-item");
      forecastItem.innerHTML = `
        <h3>${day}</h3>
        <p>Temperature: ${avgTemp} °C</p>
      `;
      forecastContainer.appendChild(forecastItem);
    });
  }
});
