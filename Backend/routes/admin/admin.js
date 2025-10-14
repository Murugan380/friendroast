const express=require("express");
const route=express.Router();
const {chat}=require("../../Shema/shema");
const {chatad}=require("../../middleware/inputvalid")
route.post("/admin",async(req,res)=>{
    const {error}=chatad.validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message})
    try{
    const already=await chat.find(req.body)
    if(already.length>0) return res.send("Message Already exit")
     const result=await chat.insertOne(req.body)
     if(result){
        res.send("success")
     }
    }
    catch(err){
        console.log("Error",err)
    }
});
module.exports=route;