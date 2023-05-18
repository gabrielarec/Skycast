const apiKey = '199e1d6ac1fdba3e17b9cc29b2bba15e';
const searchBtn = document.getElementById('city-form')

searchBtn.addEventListener('submit', event => {
    event.preventDefault();
    const city = document.getElementById('city-input').value;

    // making API request
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
        const geoCoords = data.coord;
        const lat = geoCoords.lat;
        const lon = geoCoords.lon;

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(forecastDat => {
           console.log(forecastDat);
           // "list" is an array of forecast details for different times
           const forecastData = forecastDat.list; 

            // empty object to store the five days forecast details
             const fiveDayForecast = {};

            // Loop through the array of forecast details
            for (let i = 0; i < forecastData.length; i++) {
            const forecast = forecastData[i];

            // Extracting the date of the forecast
            const forecastDate = forecast.dt_txt.split(" ")[0];

            // Adding the forecast date if is not already in the fiveDayForecast object.
            if (!fiveDayForecast[forecastDate]) {
                fiveDayForecast[forecastDate] = [];
        }
            // Adding the forecast details to the corresponding date in the fiveDayForecast object
                fiveDayForecast[forecastDate].push({
                    temperature: forecast.main.temp,
                    humidity: forecast.main.humidity,
                    icon: forecast.weather[0].icon,
                    wind: forecast.wind.speed,
                });
        }

        // Outputs an object with five dates and an array of forecast details for each date
        console.log(fiveDayForecast); 
            let forecastDisplay = document.getElementById('five-days-forecast');
                    while (forecastDisplay.firstChild) {
                    forecastDisplay.removeChild(forecastDisplay.firstChild);
       }
        // Create a new child div element
            Object.keys(fiveDayForecast).forEach(key => {
            let perDayDisplay = document.createElement("div");
            perDayDisplay.id = `${key}-Day-Forecast`
            const dayForecast = fiveDayForecast[key];

        // displaying five days forecast data
        perDayDisplay.innerHTML = `
        <p>Date: ${key}</p>
        <img src="https://openweathermap.org/img/w/${dayForecast[0].icon}.png">
        <p>Temperature: ${dayForecast[0].temperature}°F</p>
        <p>Humidity: ${dayForecast[0].humidity}%</p>
        <p>Wind Speed: ${dayForecast[0].wind}m/s</p>
      `;
                    forecastDisplay.append(perDayDisplay);

        });

        })
         // displaying weather data
        const weatherDisplay = document.getElementById('weather-display');
        weatherDisplay.innerHTML = `
        <h2>${data.name}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
        <p>Temperature: ${data.main.temp}°F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed}m/s</p>
      `;

         // adding city to search history
        const searchHistory = document.getElementById('search-history');
        const cityButton = document.createElement('button');
        cityButton.textContent = data.name;
        cityButton.addEventListener('click', () => {
        // making API request for selected city
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${data.name}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
        // displaying weather data for selected city
            weatherDisplay.innerHTML = `
              <h2>${data.name}</h2>
              <p>Date: ${new Date().toLocaleDateString()}</p>
              <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
              <p>Temperature: ${data.main.temp}°F</p>
              <p>Humidity: ${data.main.humidity}%</p>
              <p>Wind Speed: ${data.wind.speed}m/s</p>
            `;
                    })
                    .catch(error => console.error(error));
            });
            searchHistory.appendChild(cityButton);
        })
        .catch(error => console.error(error));
});
