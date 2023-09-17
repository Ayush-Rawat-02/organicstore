const express = require('express');
const {body,validationResult}= require('express-validator');
const Contact = require('../models/Contact');
const router = express.Router()

router.post("/contact-us",
[ 
body('email').isEmail(),
body('name').isLength({ min: 5 })]
,async(req,res)=>{
    const errors= validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }
     try{
       await Contact.create({
            name:req.body.name,
            email:req.body.email,
            msg:req.body.msg
        }).then(res.json({success:true}))
     }catch(error){
        console.log(error);
        res.json({success:false});
     }
})

module.exports=router;