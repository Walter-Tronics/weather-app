let date = document.querySelector("#date");
let forecastElements = document.querySelector("#weather-forecast");
let weatherCondition = document.querySelector("#condition");
let iconToday = document.querySelector(".icon-today");
let place = document.querySelector("#city");
let temperature = document.querySelector("#temp");
let precipitation = document.querySelector("#precipitation");
let wind = document.querySelector("#wind");
let form = document.querySelector(".search-form");
let searchInput = document.querySelector("#search-input");

let apiKey = "7746bdeabca928cfedcad71e52fd9d66";

function showDay(dayNumber) {
 let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayNumber];
}

function timeCycle(minutes, hours) {
  if (minutes < 10) {
    return "0" + minutes;
  } else if (hours < 12) {
    return "0" + hours;
  } else {
    return minutes;
  }
}

function showDate(date) {
  let day = showDay(date.getDay());
  let hours = timeCycle(date.getHours());
  let minutes = timeCycle(date.getMinutes());

  return `${day} ${hours} : ${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastHTML = "";
  forecast.forEach((forecastDay, index) => {
    if (index < 6) {
      forecastHTML += `  
        <div class="days__block">
        <div class="block-date">${formatDay(forecastDay.dt)}</div>
        <img src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png"
          class="block-image" alt="" width="42">
        <div class="block-temps">
          <span class="temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
        <span class="temperature-min"> ${Math.round(
          forecastDay.temp.min
        )}° </span>
    </div>
    </div>`;
    }
  });

  forecastElements.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  // console.log(coordinates);
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function searchWeather(location) {
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?&appid=${apiKey}&units=metric`;
  axios.get(weatherUrl + "&" + location).then((response) => {
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const localTime = new Date().getTime();
    const currentUtcTime = localOffset + localTime;
    const timeZone = response.data.timezone;
    const cityOffset = currentUtcTime + 1000 * timeZone;
    date.innerHTML = showDate(new Date(cityOffset));
    place.innerHTML = response.data.name;
    weatherCondition.innerHTML = response.data.weather[0].main;
    temperature.innerHTML = Math.round(response.data.main.temp);
    wind.innerHTML = Math.round(response.data.wind.speed);
    precipitation.innerHTML = Math.round(response.data.main.humidity);
    getForecast(response.data.coord);
    
    // iconToday.setAttribute(
    //   "src",
    //   "http://openweathermap.org/img/w/" +
    //     response.data.weather[0].icon +
    //     ".png"
    // );
  });

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let city = searchInput.value;
  if (searchInput.value) {
    searchInput.value = null;
  }
  searchWeather(`q= ${city}`);
});

let currentBtn = document.querySelector(".current-btn");

currentBtn.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition((position) => {
    searchWeather(
      "lat=" + position.coords.latitude + "&lon=" + position.coords.longitude
    );
  });
});
searchWeather("q=tehran");
