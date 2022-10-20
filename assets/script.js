// Grabbing ids from html
var searchInput = $('#search-input');
var submitBtn = $('#submit-btn');
var weatherContainer = $('#weather-container');
var forecastContainer = $('#forecast-container');
var savedCitiesContainer = $('#savedCities');
// my account apikey from website weather api
var apikey = '80f8dcefe3ef6ce2455873840b1e67b5';

// On the 'submit button'
submitBtn.on("click", function (event) {
    event.preventDefault();
    // .val() grabs the value stored inside the textbox, then we assign the value to the var
    var cityInput = searchInput.val();
    cityWeatherInfo(cityInput);

    var city = {
        city: cityInput,
    }

    // Stringify and set key in localStorage to todos array
    var savedCity = JSON.parse(localStorage.getItem("savedCity")) || [];

    // Unshift so the latest search is at the first index and at the top of the search history container
    savedCity.unshift(city);

    localStorage.setItem("savedCity", JSON.stringify(savedCity));
    
    renderLocalStorage();
})

var cityWeatherInfo = function (searchedCity) {

    //fetching current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${apikey}`)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (cityWeatherData) {
                        console.log(cityWeatherData);
                        displayCurrentCityWeather(cityWeatherData);
                    })
            }
        })

    // Fetching the 5 day forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&appid=${apikey}`)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (cityWeatherData) {
                        console.log('City Weather Api');
                        console.log(cityWeatherData);
                        displayCityForecast(cityWeatherData);
                    })
            }
        })
}

// Displaying current city weather
var displayCurrentCityWeather = function (searchedCityData) {
    // setting the weatherContainer to be empty so that everytime we research a city, the old city data will disappear
    weatherContainer.html("");

    // Grabbing info from the returned data
    var cityName = searchedCityData.name;
    // converting returned kelvin data to fahrenheit 
    var cityTemp = (1.8 * (searchedCityData.main.temp - 273) + 32).toFixed(2);
    var cityWind = (searchedCityData.wind.speed).toFixed(2);
    var cityHumidity = searchedCityData.main.humidity;
    // Icon code from the database, will be used to store icon image
    var iconCode = searchedCityData.weather[0].icon;

    // Format of this moment is 10/16/2022
    var currentDate = moment().format("M/DD/YYYY");

    // Creating container for name & date to store and display grabbed data
    // $('<tag_name>) creates tags dynamically
    var cityNameEl = $('<h2 style="color:black">');
    var cityTempEl = $('<h5 style="color:black">');
    var cityWindEl = $('<h5 style="color:black">');
    var cityHumidityEl = $('<h5 style="color:black">');

    // Creating img el to store icon from the returned data, <img> can store an icon, the <i> doesn't work
    var imgIconEl = $('<img>')

    // icon is an img stored in this weather api database, we grab the img by going to the url
    // rn i am storing the url
    var iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;

    // attaching an attribute to the imgIconEl so that the src can grab the image
    imgIconEl.attr({
        id: "imgIcon",
        src: iconURL,
        alt: "weather icon"
    })

    // Attaching the City Name and The current Date first on top of the weather container
    cityNameEl.text(`${cityName} (${currentDate})`);

    // Appending the icon from the weather data after the city name and date
    cityNameEl.append(imgIconEl);
    weatherContainer.append(cityNameEl);

    // Adding the text of the city temp in 3rd
    cityTempEl.text(`Temp: ${cityTemp}°F`);
    weatherContainer.append(cityTempEl);

    // Adding the city wind text in 4th
    cityWindEl.text(`Wind: ${cityWind} MPH`);
    weatherContainer.append(cityWindEl);

    // Adding city humidity in text 5th
    cityHumidityEl.text(`Humidity: ${cityHumidity} %`);
    weatherContainer.append(cityHumidityEl);
}

var displayCityForecast = function (searchedCityData) {
    // setting the weatherContainer to be empty so that everytime we research a city, the old city data will disappear
    forecastContainer.html("");
    forecastContainer.addClass(`mt-2 d-flex flex-wrap`);
    var ForecastTextEl = $('<h2>');
    ForecastTextEl.text(`5-Day Forecast:`);
    forecastContainer.append(ForecastTextEl);

    // The weather api for the forecast returns an array of 40 index's. The 0th index is the next day at midnight, and the 4th array is the 12pm mark of the same day. Then every 8th array is the following midnight after that. 
    for (var i = 0; i <= searchedCityData.list.length; i++) {
        if (i === 4 || i === 12 || i === 20 || i === 28 || i === 36) {
            // Creating container for forecast to store and display grabbed data
            var forecastDivEl = $('<div>');
            // cannot store weather info under 1 div, need eachForecastEl to seperate each day's weather
            var eachForecastEl = $('<div style="border: 3px solid black">');
            var dateEl = $('<h3>');
            var cityTempEl = $('<h5>');
            var cityWindEl = $('<h5>');
            var cityHumidityEl = $('<h5>');
            var imgIconEl = $('<img>');

            // eachForecastEl.addClass("class ="d-flex justify-content-between" ");

            // Grabbing date data and appending
            dateEl.text(moment(searchedCityData.list[i].dt_txt).format("M/DD/YYYY"));
            forecastDivEl.append(dateEl);

            // icon code for grabing the image, then place in url to pull img on html
            var iconCode = searchedCityData.list[i].weather[0].icon;
            var iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;

            // attaching an attribute to the imgIconEl so that the src can grab the image
            imgIconEl.attr({
                id: "imgIcon",
                src: iconURL,
                alt: "weather icon"
            })
            forecastDivEl.append(imgIconEl);

            // Grabbing temp data from the searchedCityData
            var cityTemp = (1.8 * (searchedCityData.list[i].main.temp - 273) + 32).toFixed(2);
            cityTempEl.html(`Temp: ${cityTemp}°F`);
            forecastDivEl.append(cityTempEl);

            var cityWind = searchedCityData.list[i].wind.speed;
            cityWindEl.text(`Wind: ${cityWind} MPH`);
            forecastDivEl.append(cityWindEl);


            var cityHumidity = searchedCityData.list[i].main.humidity;
            cityHumidityEl.text(`Humidity: ${cityHumidity}`);
            forecastDivEl.append(cityHumidityEl);

            eachForecastEl.append(forecastDivEl);
            forecastContainer.append(eachForecastEl);
        }
    }
}


// The following function renders items in a todo list as <li> elements
var renderLocalStorage = function () {
    // Clear savedCities container so that previous searches dont pile up together
    savedCitiesContainer.html("");

    // Get stored todos from localStorage
    var citiesFromLocalStorage = JSON.parse(localStorage.getItem("savedCity")); // || []

    for (let i = 0; i < citiesFromLocalStorage.length; i++) {
        var eachSavedCityEl = $('<li>');
        eachSavedCityEl.text(citiesFromLocalStorage[i].city);
        eachSavedCityEl.attr('data-city', citiesFromLocalStorage[i].city)
        eachSavedCityEl.addClass('card card-body my-3 list-group-item-action')
        savedCitiesContainer.append(eachSavedCityEl);
    }
} 

// Event delegation on the li items,
savedCitiesContainer.on('click', function(event) {
    // Grabbing the city name from the custom class 'data-city
    var cityName = event.target.getAttribute("data-city");

    // Calling the city name in the function to get the city weather data
    cityWeatherInfo(cityName);
})

// call this function so that previous searches come up right away
renderLocalStorage();
