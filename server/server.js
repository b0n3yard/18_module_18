const mongoose = require('mongoose')
const express = require('express')
const session = require('express-session')
const myroutes = require('./controllers')
const PORT = process.env.PORT || 3333
const app = express()
app.use(express.json())
require('dotenv').config()

const db = require('./config/connection')
app.use('/', myroutes)
db.on('open',()=>{
    app.listen(PORT, ()=>{console.log(`started, listening on ${PORT}`)})
})
