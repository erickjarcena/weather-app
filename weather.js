const express = require("express")
const cities = require('philippines/cities')
const where = require('lodash');
const app = express()
const apiKey = "635400bf4f54c6cd43cff06a780df130";

app.set('view engine' , 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/src', express.static('src'))
app.use('/node_modules/bootstrap/dist/css', express.static('node_modules/bootstrap/dist/css'))

app.get("/", (req,res) => {
   const weatherUpdate = {location: "Location", temp: "Temp", desc: "Description", humidity: "Humidity", wind:"Wind"}
   res.render('index', {weatherUpdate: weatherUpdate})

});

app.post("/", async (req,res) => {


    let province = await req.body.province

    let filteredCities = where.filter(cities, 
        { 'province': province}
    );
    const weatherUpdate = [
       
    ]
    for (const index in filteredCities) {  

        let location = await filteredCities[index].name
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
        const response = await fetch(apiUrl)
        const weatherData = await response.json()
        const temp = Math.floor(weatherData.main.temp)
        const desc = weatherData.weather[0].description;
        const humidity = weatherData.main.humidity;
        const wind = weatherData.wind.speed;

        weatherUpdate.location = location;
        weatherUpdate.temp = temp;
        weatherUpdate.desc = desc;
        weatherUpdate.humidity = humidity;
        weatherUpdate.wind = wind;

        weatherUpdate.push({location: location, temp: temp, desc:desc, humidity: humidity, wind: wind})
    }
    res.render('index', {weatherUpdate: weatherUpdate})
});


app.listen(3000, () => console.log("Server started on port 3000"));