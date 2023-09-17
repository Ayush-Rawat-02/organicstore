const mongoose = require('mongoose');
const {Schema}=mongoose;

const FbSchema= new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    msg:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('feedback',FbSchema)