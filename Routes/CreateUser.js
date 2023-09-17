const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

//for reset password mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env,USER_EID,
    pass: process.env.USER_PASS
  }
})


router.post("/createuser",
  [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'Incorrect Password').isLength({ min: 5 })]
  , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);
    const authToken = jwt.sign(secPassword, process.env.JWT_SECRET)
    try {
      await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location
      }).then(res.json({ success: true, authToken: authToken }))
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  })


router.post("/loginuser", [
  body('email').isEmail(),
  body('password', 'Incorrect Password').isLength({ min: 5 })]
  , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let email = req.body.email;
    try {
      let userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({ errors: "Try Again with correct details" });
      }
      const pwdCompare = await bcrypt.compare(req.body.password, userData.password)
      if (!pwdCompare) {
        return res.status(400).json({ errors: "Try Again with correct details" });
      }

      const data = {
        user: {
          id: userData.id
        }
      }

      const authToken = jwt.sign(data, process.env.JWT_SECRET)
      return res.json({ success: true, authToken: authToken, role: userData.role });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  })



//For sending forgot password mail

router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  try {
    let userCheck = await User.findOne({ email });
    if (!userCheck) {
      return res.status(400).json({ errors: "User Does Not Exist" });
    }
    //User exists creating one time link
    const secret = process.env.JWT_SECRET + userCheck.password;
    const payload = {
      email: userCheck.email,
      id: userCheck.id
    }

    const token = jwt.sign(payload, secret, { expiresIn: '120s' });
    const mailOptions = {
      from: process.env.USER_EID,
      to: email,
      subject: "Sending Email For password Reset",
      text: `This Link Valid For 2 MINUTES ${process.env.FRONTEND_URL}/reset-password/${userCheck.id}/${token}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error", error);
        res.status(400).json({ success: false, message: "email not send" })
      } else {
        console.log("Email sent", info.response);
        res.status(201).json({success: true, message: "Email sent Successfully" })
      }
    })

  }
  catch (e) {
    console.log(e);
  }
});


router.post("/resetpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  let userCheck = await User.findOne({ _id:id });
  if (!userCheck) {
    return res.status(400).json({  success:false,errors: "Invalid User" });
  }
  const secret = process.env.JWT_SECRET + userCheck.password;
  try {
    
    const payload = jwt.verify(token, secret);
    if(payload.email && payload.id)
    {  const salt = await bcrypt.genSalt(10);
       let newPassword = await bcrypt.hash(password, salt);
       const setnewuserpswd=await User.findByIdAndUpdate({_id:id},{password:newPassword});
       setnewuserpswd.save();
       res.status(200).json({ success:true});
    }
    else
      res.status(400).json({ success:false});
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success:false});
  }

});

router.get("/resetpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  let userCheck = await User.findOne({ _id:id });
  if (!userCheck) {
    return res.status(400).json({ errors: "Invalid User" });
  }
  const secret =process.env.JWT_SECRET + userCheck.password;
  try {
    const payload = jwt.verify(token, secret);
    if(payload.email && payload._id)
       res.status(200).json({ success:true});
    else
     return res.status(400).json({ success:false});
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;