const {model, Schema} =  require('mongoose')
const Reactions = require('./Reactionschema')

const Thoughts = new Schema({
    thoughttext:{
        type:String,
        required: true,
        min: [1, 'text must exist'],
        max: [280,'text to large']
    },
    createdat:{
        type:Date,
        default: Date.now
    },
    username:{
        type:String,
        required: true
    },
    reactions:[{
        Reactions
    }]

})
Thoughts.virtual('reactioncount').get(function(){
    return this.reactions.length
})

const Thought = model('Thought', Thoughts)

module.exports = Thought