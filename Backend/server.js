const express=require('express');
const cors = require('cors');
const{mongoose}=require("./Shema/shema");
const sigin=require("./routes/user/signin")
const login=require("./routes/user/login")
const fileup=require("./routes/user/fileup")
const path=require('path')
const admin=require("./routes/admin/admin")
require('dotenv').config(); 
const app=express();
app.use(cors());
app.use(express.json())
run();
async function run(){
    try{
    await mongoose.connect(process.env.URL)
    console.log("Connected")
    }
    catch(err){
        console.log(err)
    }
}
app.use(sigin);
app.use(login);
app.use(fileup);
app.use(admin);
app.use('/uploads', express.static(path.join(__dirname, 'ProfileIMG')));
app.use((req,res)=>{
    res.status(404).send({message:"invalid route"})
})
app.listen(process.env.PORT,()=>{
    console.log(`Run in ${process.env.PORT}`)
})
