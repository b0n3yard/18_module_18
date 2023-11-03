const router = require('express').Router()
const user_routes = require('./user_routes')
const thoughts_route = require('./thoughts_route')

router.use('/api',[user_routes,thoughts_route])

module.exports = router