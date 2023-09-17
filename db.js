const mongoose = require('mongoose');


const mongoDB=()=>{
    main().catch(err=>console.log(err));

    async function main(){ 
        await mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true});
        console.log("connected");

    }
}


module.exports=mongoDB;