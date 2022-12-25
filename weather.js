const express = require("express")
const cities = require('philippines/cities')
const provinces = require('philippines/provinces')
const where = require('lodash');
const moment = require('moment');
const app = express()

app.set('view engine' , 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/src', express.static('src'))
app.use('/node_modules/bootstrap/dist/css', express.static('node_modules/bootstrap/dist/css'))
require('dotenv').config()

app.get("/", (req,res) => {

   const provinceData = []
   for (const index in provinces) {
        provinceData.push({name: provinces[index].name, key: provinces[index].key})
   }
   const currentTimeandProv = {time: "", province: ""}
   const weatherUpdate = {location: "Location", temp: "Temp", desc: "Description", humidity: "Humidity", wind:"Wind"}
   res.render('index', {weatherUpdate: weatherUpdate, provinceData: provinceData, currentTimeandProv: currentTimeandProv})
});

app.post("/", async (req,res) => {

    let province = await req.body.province
    let filteredCities = where.filter(cities, 
        { 'province': province}
    );
    const weatherUpdate = []
    for (const index in filteredCities) {  

        let location = await filteredCities[index].name
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`
        const response = await fetch(apiUrl)
        const weatherData = await response.json()
        if(weatherData.cod == '404'){
            continue;
        }
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

    const provinceData = []
    for (const index in provinces) {
            provinceData.push({name: provinces[index].name, key: provinces[index].key})
    }

    let filteredProvince = where.filter(provinces, 
        { 'key': province}
    );

    const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    const currentTimeandProv = { time: currentTime, province: filteredProvince[0].name}
    
    res.render('index', {weatherUpdate: weatherUpdate, provinceData: provinceData, currentTimeandProv: currentTimeandProv})

});

app.listen(3000, () => console.log("Server started on port 3000"));