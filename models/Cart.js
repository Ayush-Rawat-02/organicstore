const mongoose = require('mongoose');
const {Schema} = mongoose;


const cartSchema = new Schema({
    quantity: { type : Number, required: true,default:1},
    product: { type: Schema.Types.ObjectId, ref: 'ProductList', required: true},
    user:{ type: Schema.Types.ObjectId, ref: 'user', required: true}
})

module.exports = mongoose.model('Cart',cartSchema);