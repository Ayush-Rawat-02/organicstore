const express = require('express');
const Feedback = require('../models/Feedback');
const {body,validationResult}= require('express-validator');
const router = express.Router()

router.post("/feedback",
[ 
body('email').isEmail(),
body('name').isLength({ min: 5 })]
,async(req,res)=>{
    const errors= validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }
     try{
       await Feedback.create({
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