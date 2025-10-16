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
const corsOptions = {
  origin: 'https://friendroast.vercel.app', // your frontend URL
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true, // if you need cookies or auth headers
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(sigin);
app.use(login);
app.use(fileup);
app.use(admin);
app.use('/uploads', express.static(path.join(__dirname, 'ProfileIMG')));
app.use((req,res)=>{
    res.status(404).send({message:"invalid route"})
})
async function run(){
    try{
    await mongoose.connect(process.env.URL)
    console.log("Connected");
      app.listen(process.env.PORT,()=>{
    console.log(`Run in ${process.env.PORT}`)
})

    }
    catch(err){
        console.log(err)
    }
}
run();
