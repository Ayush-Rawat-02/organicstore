const express = require('express')
const router = express.Router()
const Cart= require('../models/Cart')
const User = require('../models/User')

//fetch items
router.get("/cart/",async (req, res) => {
    const { email } = req.query; 
    let userData = await User.findOne({ email });
    if (!userData) {
          return res.status(400).json({ errors: "Invalid user" });
    }
  try {
    const cartItems = await Cart.find({ user: userData.id }).populate('product');
     console.log(cartItems);
    res.status(200).json({success:true,data:cartItems});
  } catch (err) {
    res.status(400).json({success:false,data:err});
  }
});

//add to cart
router.post("/cart",async (req, res) => {
  const { email, product } = req.body;
  let userData = await User.findOne({ email });
  if (!userData) {
        return res.status(400).json({ errors: "Invalid user" });
  }
  const cart = new Cart({product,user:userData._id});
  try {
    const doc = await cart.save();
    const result = await doc.populate('product');
    res.status(200).json({success:true,data:result});
    } catch (err) {
    res.status(400).json({success:false,data:err});
    }
});

//delete items
router.delete("/cart/:id", async (req, res) => {
    const { id } = req.params;
    try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json({success:true,data:doc});
  } catch (err) {
    res.status(400).json({success:false,data:err});
  }
});


//update cart
router.patch("/cart/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate('product');

    res.status(200).json({success:true,data:result});
  } catch (err) {
    res.status(400).json({sucsess:false,data:err});
  }
});

module.exports=router;