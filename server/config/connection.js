const mongoose = require('mongoose')

const PORT = process.env.port || 3333

mongoose.connect('mongodb://127.0.0.1:27017/social_db')
module.exports = mongoose.connection