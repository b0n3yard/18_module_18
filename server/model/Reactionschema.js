const {model, Schema} =  require('mongoose')

const Reactions = new Schema({
    reactionId:{
        type: Schema.Types.ObjectId,
        default: ()=> new Schema.Types.ObjectId()
    },
    reactionbody:{
        type:String,
        required:true,
        max: [280,'too long']
    },
    createdat:{
        type:Date,
        default: Date.now
    },
    username:{
        type:String,
        required: true
    },
})

Reactions.virtual('CreatedAt').get(function(){
    return this.createdat.toLocaleString()
})

module.exports = Reactions