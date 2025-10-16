const express=require("express");
const route=express.Router();
const bcrypt=require('bcrypt')
const {user}=require("../../Shema/shema")
const {userdatavalidate}=require("../../middleware/inputvalid")
route.post('/sign',async(req,res)=>{
    delete req.body.conpass;
        const {error}=userdatavalidate.validate(req.body);
        if(error) {
            console.log("Joi error",error.details[0].message)
            return res.status(400).send({message:error.details[0].message})
        }
    try{
        const name=req.body.name;
        const already=await user.find({name:name});
        if(already.length>0) return res.send({message:"Already Exit Try a different username"});
        const password=await bcrypt.hash(req.body.password,10);
        const inp={name:name,password:password}
        const result=await user.insertOne(inp);
        if(result) return res.send({message:"Success"})
        else return res.send({message:"unsuccess"})
    }
    catch(err){
        console.log("Mongo error",err)
        res.send({message:"Network error"})
    }
})
module.exports=route;
