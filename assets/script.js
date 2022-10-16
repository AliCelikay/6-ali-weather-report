// Grabbing ids from html
var searchInput = $('#search-input');
var submitBtn = $('#submit-btn');
var weatherContainer = $('#weather-container');
var forecastInfo = $('#forecast-info');
var savedCities = $('#savedCities');
// my apikey
var apikey = '80f8dcefe3ef6ce2455873840b1e67b5';

// On the 'submit button'
submitBtn.on("click", function(event) {
    event.preventDefault();
    // .val() grabs the value stored inside the textbox, then we assign the value to the var
    var cityInput = searchInput.val();
    cityWeatherInfo(cityInput);
})

var cityWeatherInfo = function(searchedCity) {

    //fetching current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${apikey}`)
    .then(function(response) {
        if(response.ok)
        {
            response.json()
            .then(function (cityWeatherData) {
                console.log(cityWeatherData);
                displayCurrentCityWeather(cityWeatherData);
                // setToLocalStorage(searchedCity);
            })
        }
    })

    // Fetching the 5 day forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&appid=${apikey}`)
    .then(function(response) {
        if(response.ok)
        {
            response.json()
            .then(function (cityWeatherData) {
                // displayCityForecast(cityWeatherData);
                // setToLocalStorage(searchedCity);
            })
        }
    })
}

// Displaying current city weather
var displayCurrentCityWeather = function(searchedCityData) {
    // setting the weatherContainer to be empty so that everytime we research a city, the old city data will disappear
    weatherContainer.html("");

    // Grabbing info from the returned data
    var cityName = searchedCityData.name;
    // converting returned kelvin data to fahrenheit 
    var cityTemp = (1.8 * (searchedCityData.main.temp - 273) + 32).toFixed(2);
    var cityWind = (searchedCityData.wind.speed).toFixed(2);
    var cityHumidity = searchedCityData.main.humidity;
    // var cityUV = ??????

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
    var iconCode = searchedCityData.weather[0].icon;
    
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
    cityTempEl.text(`Temp: ${cityTemp} °F`);
    weatherContainer.append(cityTempEl);

    // Adding the city wind text in 4th
    cityWindEl.text(`Wind: ${cityWind} MPH`);
    weatherContainer.append(cityWindEl);

    // Adding city humidity in text 5th
    cityHumidityEl.text(`Humidity: ${cityHumidity} %`);
    weatherContainer.append(cityHumidityEl);
}
