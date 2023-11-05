const {model, Schema} =  require('mongoose')
const Reactions = require('./Reactionschema')
const dayjs =  require('dayjs')

const Thoughts = new Schema({
    thoughttext:{
        type:String,
        required: true,
        min: [1, 'text must exist'],
        max: [280,'text to large']
    },
    createdat:{
        type:Date,
        default: Date.now,
        get: function(){
            return dayjs(this.createdAt).format('MM/DD/YYYY hh:mm')
        }
    },
    username:{
        type:String,
        required: true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reactions:[{
        type: Schema.Types.Mixed,
        Reactions
        
    }]

},{getters: true})
Thoughts.virtual('reactioncount').get(function(){
    return this.reactions.length

})


Thoughts.pre('save', function(next) {
    if (!this.createdat) {
        this.createdat = new Date();
    }
    next();
});

const Thought = model('Thought', Thoughts)

module.exports = Thought