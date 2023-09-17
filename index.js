require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors');
const mongoDB=require("./db");
mongoDB();

app.use(cors());
app.use(express.json())

app.use('/api',require("./Routes/CreateUser"));
app.use('/api',require("./Routes/DisplayData"));
app.use('/api',require("./Routes/Checkout"));
app.use('/api',require("./Routes/Feedback"));
app.use('/api',require("./Routes/ContactUs"));
app.use('/api',require("./Routes/Product"));
app.use('/api',require("./Routes/Cart"));


app.get('/',(req, res) => {
  res.send('Hello World!')
})


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})