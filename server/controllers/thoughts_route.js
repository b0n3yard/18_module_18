const router = require('express').Router()
const { default: mongoose } = require('mongoose')
const {User,Thought} = require('../model')

router.post('/create', async(cro,sro)=>{
    const user = await User.findOne({username: cro.body.username})
    console.log(user)
    const thoughtdata = cro.body
    const thoughts = await Thought.create({
        ...thoughtdata,
        user:user._id
    })
    console.log(thoughts._id)

    user.thoughts.push(thoughts)
    await user.save();
    

    sro.json(thoughts)
})
router.get('/thoughts', async (cro,sro)=>{
    const thougts = await Thought.find().lean()
    console.log(thougts)
    sro.json(thougts)
})
router.get('/thoughts/:id', async (cro,sro)=>{
    const id = cro.params.id
    const thougts = await Thought.findById(id).populate('reactions').lean()
    console.log(thougts)
    sro.json(thougts)
})

router.put('/thoughts/:id', async (cro,sro)=>{
    const id = cro.params.id
    const users = await Thought.findByIdAndUpdate(id,{thoughttext: cro.body.thoughttext},{new: true})
    sro.json(users)
})
router.delete('/thoughts/:id', async (cro,sro)=>{
    const id = cro.params.id
    const changed = await Thought.deleteOne({_id: id})
    sro.json(changed)

})
router.post('/thoughs/:id/reactions', async(cro,sro)=>{
    const reaction = {
        // reactionId: new mongoose.Types.ObjectId(),
        reactionbody: cro.body.reactionbody,
        username: cro.body.username
    }
    const thougts = await Thought.findById(cro.params.id)
    thougts.reactions.push(reaction)
    console.log(reaction)
    await thougts.save()
    sro.json(reaction)
})
router.delete('/thoughs/:id/reactions/:reactionIds', async (cro,sro)=>{
 const{id,reactionIds} = cro.params
    console.log(reactionIds)
 const thought = await Thought.findOne({_id: id})

  thought.reactions.pull({reactionId: reactionIds})

 console.log(thought.reactions )
 await thought.save()
//  AndUpdate({
//     _id: id},
//     {$pull: {reactions:reactionIds}},{new:true}
//     )
    sro.json(thought)
})
module.exports = router