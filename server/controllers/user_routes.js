const router = require('express').Router()
const {User,Thought} = require('../model')

router.post('/register', async (cro,sro)=>{
    const user = await User.create(cro.body)
    sro.send('hi')

})
router.get('/users', async (cro,sro)=>{
    const users = await User.find().populate('thoughts').populate('friends').lean()
    sro.send(users)
})
router.get('/users/:id', async (cro,sro)=>{

    const id = cro.params.id
    const auser = await User.findById(id).populate('thoughts').populate('friends')
    const modifieduser = auser.toObject({ getters: true })
    modifieduser.friendcount = auser.friendcount
    const {friends, ...rest } = modifieduser;
    const reorderedUser = { ...rest, friends };
    sro.send(reorderedUser)

})
router.put('/users/:id', async (cro,sro)=>{
    const id = cro.params.id
    const users = await User.findByIdAndUpdate(id,{ username:cro.body.username, password: cro.body.password,email: cro.body.email},{new: true})
    sro.json(users)
})
router.post('/users/:id/friends/:friendId', async (cro,sro)=>{
    const{id,friendId} = cro.params

    const friend = await User.findOne({_id: id})
    friend.friends.push(friendId)
    await friend.save()
    sro.json(friend)

})
router.delete('/users/:id',async (cro,sro)=>{
    const id = cro.params.id
    const deleted = await User.deleteOne({_id: id})
    sro.json(deleted)
})
router.delete('/users/:id/friends/:friendId', async (cro,sro)=>{
    const{id,friendId} = cro.params
    const friend = await User.findOneAndUpdate({_id: id},{
        $pull:{friends:friendId}
    },{new:true})
    sro.json(friend)

})
module.exports = router