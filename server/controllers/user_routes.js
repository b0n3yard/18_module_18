const router = require('express').Router()
const {User} = require('../model')

router.post('/register', async (cro,sro)=>{
    const user = await User.create(cro.body)
    sro.send('hi')

})
router.get('/users', async (cro,sro)=>{
    const users = await User.find().lean()
    sro.send(users)
})
module.exports = router