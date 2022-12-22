const express = require("express")
const request = require("request")
const cities = require('philippines/cities')
const app = express()

app.use('/src', express.static('src'))
app.use('/node_modules/bootstrap/dist/css', express.static('node_modules/bootstrap/dist/css'))
app.get("/",(req,res) => {
    res.sendFile('./index.html', {root: __dirname});
});

app.get('/cities', (req, res) =>{
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if(endIndex < cities.length){
        results.next = { 
            page: page + 1,
            limit: limit
        }
    }
   
    if (startIndex > 0){
        results.previous = { 
            page: page - 1,
            limit: limit
        }
    }
    results.results = cities.slice(startIndex, endIndex)
    res.json(results)
})

app.listen(3000, () => console.log("Server started on port 3000"));