const {model, Schema} =  require('mongoose')

const Users = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email:{
        type:String,
        required: true,
        unique: true,
        validate:{
            validator(val){
                return  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/gi.test(val)
            },
            message(){
                return 'email address not valid'
            }
        }
    },
    password:{
        type:String,
        required: true
    },
    thoughts:[{
        type:Schema.Types.ObjectId,
        ref: 'thoughts'
    }],
    freinds:[{
        type: Schema.Types.ObjectId,
        ref:'Users'
    }]
})

const User = model('Users', Users)
module.exports = User