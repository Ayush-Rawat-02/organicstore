const mongoose = require('mongoose');
const {Schema} = mongoose;


const ProductSchema = new Schema({
    title: { type : String, required: true, unique: true},
    price: { type: Number, min:[1, 'wrong min price'], max:[10000, 'wrong max price']},
    category: { type : String, required: true},
    imgsrc:{ type : String, required: true},
    //deleted: { type : Boolean, default: false},
})

module.exports=mongoose.model('ProductList',ProductSchema)