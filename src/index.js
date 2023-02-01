let date = document.querySelector("#date");
let days = document.querySelectorAll(".days__block");
let weatherCondition = document.querySelector("#condition");
let iconToday = document.querySelector(".icon-today");
let place = document.querySelector("#city");
let temperature = document.querySelector("#temp");
let precipitation = document.querySelector("#precipitation");
let wind = document.querySelector("#wind");
let form = document.querySelector(".search-form");
let searchInput = document.querySelector("#search-input");

let root = "https://api.openweathermap.org";
let apiKey = "22983ce8635ace03932912e7b2f13972";

function showDay(dayNumber) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayNumber];
}

function showMinutes(minutes) {
  if (minutes < 10) {
    return "0" + minutes;
  } else {
    return minutes;
  }
}

function showDate(date) {
  let day = showDay(date.getDay());
  let hours = date.getHours();
  let minutes = showMinutes(date.getMinutes());

  return `${day} ${hours} : ${minutes}`;
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
    // iconToday.setAttribute(
    //   "src",
    //   "http://openweathermap.org/img/w/" +
    //     response.data.weather[0].icon +
    //     ".png"
    // );
  });
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?&appid=${apiKey}&units=metric`;
  axios.get(forecastUrl + "&" + location).then((response) => {
    days.forEach((element, index) => {
      let day = new Date(response.data.list[index].dt_txt);
      element.querySelector(".block-date").innerHTML = showDate(day);
      element.querySelector(".block-temp").innerHTML =
        Math.round(response.data.list[index].main.temp) + " ° ";
      element
        .querySelector(".block-image")
        .setAttribute(
          "src",
          "http://openweathermap.org/img/w/" +
            response.data.list[index].weather[0].icon +
            ".png"
        );
    });
  });
}

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
