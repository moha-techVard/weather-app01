// Écoute l'événement DOMContentLoaded pour s'assurer que le DOM est complètement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
  // Sélectionne le bouton de recherche
  const button = document.getElementById("button");
  // Clé API pour accéder aux données météo
  const APIkey = "e8e7dfb29cb280a65590ba5f70092341";
  // URL de l'API pour les données météorologiques actuelles
  const currentWeatherApi =
    "https://api.openweathermap.org/data/2.5/weather?q=";
  // URL de l'API pour les prévisions météorologiques
  const forecastApi = "https://api.openweathermap.org/data/2.5/forecast?q=";
  // Ajoute un écouteur d'événement au bouton pour traiter les clics
  button.addEventListener("click", (event) => {
    event.preventDefault(); // Empêcher le comportement par défaut du formulaire
    document.querySelector(".block2").style.display = "block";
    document.querySelector(".block3").style.opacity = "1";
    document.querySelector(".video-background").style.display = "block";
    event.preventDefault;
    // Appelle les fonctions pour obtenir les données météo et les prévisions
    getCurrentWeather();
    getForecast();
    // Réinitialise la valeur du champ de saisie de la ville
    input();
  });
  // Fonction pour réinitialiser le champ de saisie de la ville
  function input() {
    document.getElementById("city").value = "";
  }
  // Fonction asynchrone pour obtenir les données météorologiques actuelles
  async function getCurrentWeather() {
    const city = document.getElementById("city").value.trim(); // Récupère le nom de la ville
    // Vérifie si le champ de saisie est vide
    if (!city) {
      alert("Please enter a city name.");
      return;
    }
    try {
      // Effectue une requête à l'API pour obtenir les données météo
      const response = await fetch(
        `${currentWeatherApi}${city}&units=metric&appid=${APIkey}`
      );
      if (!response.ok) {
        // Vérifie si la réponse est correcte
        throw new Error("Erreur réseau : " + response.statusText);
      }
      // Parse les données JSON
      const data = await response.json();
      console.log(data); // Affiche les données dans la console (pour le débogage)
      displayCurrentWeather(data);
    } catch (error) {
      console.error("Erreur:", error); // Affiche l'erreur dans la console
      alert("Could not retrieve current weather data. Please try again later.");
    }
  }
  // Fonction pour afficher les données météorologiques actuelles
  function displayCurrentWeather(data) {
    // Sélectionne les éléments du DOM pour afficher les données
    const h1 = document.querySelector("h1");
    const h2 = document.querySelector(".cityName");
    const p1 = document.getElementById("p1");
    const p2 = document.getElementById("p2");
    const img = document.getElementById("img");
    const video = document.getElementById("background-video");
    // Réinitialise la valeur du champ de saisie de la ville (inutile car le champ a déjà été réinitialisé plus tôt)
    document.getElementById("city").style.value = " ";
    // Met à jour le contenu des éléments avec les données récupérées
    h1.innerHTML = data.name;
    h2.innerHTML = data.main.temp + "°C";
    p1.innerHTML = data.main.humidity + "%";
    p2.innerHTML = data.wind.speed + " m/s";
    // Détermine les conditions météorologiques et met à jour les images en conséquence
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

  // Fonction asynchrone pour obtenir les prévisions météorologiques
  async function getForecast() {
    const city = document.getElementById("city").value.trim(); // Récupère le nom de la ville
    if (!city) {
      alert("Please enter a city name.");
      return;
    }
    try {
      // Effectue une requête à l'API pour obtenir les prévisions
      const response = await fetch(
        `${forecastApi}${city}&units=metric&cnt=14&appid=${APIkey}`
      );
      if (!response.ok) {
        // Vérifie si la réponse est correcte
        throw new Error("Erreur réseau : " + response.statusText);
      }
      // Parse les données JSON
      const data = await response.json();
      // Appelle la fonction pour afficher les prévisions
      displayForecast(data);
    } catch (error) {
      console.error("Erreur:", error); // Affiche l'erreur dans la console
      alert("Could not retrieve forecast data. Please try again later.");
    }
  }
  // Fonction pour afficher les prévisions météorologiques
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
