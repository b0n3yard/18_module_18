const router = require('express').Router()
const { default: mongoose } = require('mongoose')
const {User,Thought} = require('../model')
const dayjs = require('dayjs')

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
    
    const thoughtsobj = thoughts.toObject({ getters: true });
    // const thoughtsobj = thoughts.toObject()
    // thoughts.CreatedAt = dayjs(thoughts.createdat).format('MM/DD/YYYY hh:mm')

    sro.json(thoughtsobj)
})
router.get('/thoughts', async (cro,sro)=>{
    const thoughts = await Thought.find().lean()
    // console.log(thougts)
    const modifiedThoughts = thoughts.map( thought =>{
        thought.createdAt = dayjs(thought.createdat).format('MM/DD/YYYY hh:mm')
        delete thought.createdat
        return thought
    })
    sro.json(modifiedThoughts)
})
router.get('/thoughts/:id', async (cro,sro)=>{
    const id = cro.params.id
    const thoughts = await Thought.findById(id).populate('reactions')
    // const { reactions: extractedReactions, createdat,reactioncount, ...thoughtsWithoutReactions } = thoughts;

const modifiedThoughts = thoughts.toObject()
// {
//   ...thoughtsWithoutReactions,
//   reactions: extractedReactions || [],
// };

modifiedThoughts.CreatedAt = dayjs(modifiedThoughts.createdat).format('MM/DD/YYYY hh:mm');
modifiedThoughts.reactioncount = thoughts.reactioncount
delete modifiedThoughts.createdat

    // const thoughtsobj = thoughts.toObject({ getters: true });
    // console.log(thoughtsobj)
    const {reactions, ...rest } = modifiedThoughts;
    const reorderedThoughts = { ...rest, reactions };
    
    sro.json(reorderedThoughts);
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
        reactionId: new mongoose.Types.ObjectId(),
        reactionbody: cro.body.reactionbody,
        username: cro.body.username
    }
    const thougts = await Thought.findById(cro.params.id)
    thougts.reactions.push(reaction)
    // console.log(reaction)
    await thougts.save()
    sro.json(reaction)
})
router.delete('/thoughs/:id/reactions/:reactionIds', async (cro,sro)=>{
 const{id,reactionIds} = cro.params
    console.log(reactionIds)
 const thought = await Thought.findOne({_id: id})

  thought.reactions.pull({reactionId: reactionIds})
  thought.reactions.forEach(function(reaction, x){
    console.log(thought.reactions[x])
    if(thought.reactions[x].reactionId.toString() === reactionIds){
    const sliced = thought.reactions.splice(x,1)[0]
    console.log('hi')}
  })

 console.log(thought.reactions[0] )
 await thought.save()
//  AndUpdate({
//     _id: id},
//     {$pull: {reactions:reactionIds}},{new:true}
//     )
    sro.json(thought)
})
module.exports = router