const express = require('express')
const router = express.Router()
const Product= require('../models/Product')

router.post("/product",async(req,res)=>{
        // this product we have to get from API body
        const product = new Product(req.body);
        try {
          const doc = await product.save();
          res.status(201).json({doc:doc,success:true});
        } catch (err) {
          res.status(400).json(err);
        }
});

//display All product
router.get("/product",async (req, res) => {
    let query = Product.find({});
    try {
      const docs = await query.exec();
      res.status(200).json({success:true,docs:docs});
    } catch (err) {
      res.status(400).json({success:false,docs:err});
    }
});

//display Single product
router.get("/product/:category",async (req, res) => {
    try {
      const product = await Product.find({category:req.params['category']});
      res.status(200).json(product);
    } catch (err) {
      res.status(400).json(err);
    }
});
  
router.patch("/product/:id" ,async (req, res) => {
    const { id }=req.params;
    try {
      const product = await Product.findOneAndUpdate({_id:id}, req.body, {new:true});
      res.status(200).json({success:true});
    } catch (err) {
      res.status(400).json({error:err,success:false});
    }
});
module.exports=router;