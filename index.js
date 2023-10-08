const express = require('express')
const app = express()
const port = 3000
const connectToMongo = require('./db')
var cors = require('cors')


// This is for mongoConnection
connectToMongo()

// This is for express to json
app.use(express.json())

// Middleware for api request from web to server
app.use(cors())


app.use('/api/auth' ,require('./routes/userAuth'))
app.use('/api/auth' ,require('./routes/employeeAuth'))

app.listen(port, ()=>{
    console.log(`Your app is running on PORT:${port}`);
})