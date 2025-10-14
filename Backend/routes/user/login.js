const express=require("express");
const route=express.Router();
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken")
const {user}=require("../../Shema/shema")
route.post('/log',async(req,res)=>{
    try{
        console.log(req.body)
        const result=await user.findOne({name:req.body.name});
        if(result){
            console.log(result);
            const match=await bcrypt.compare(req.body.password,result.password)
            if(match){
                const token=jwt.sign({name:result.name,id:result._id},process.env.KEY,{expiresIn:"7d"});
                res.send({message:"success",token:token})
            }
            else{
                return res.status(400).send({message:"Invalid password"})
            }
        }
        else{
           return res.status(400).send({message:"Invalid User"})
        }
    }
    catch(err){
        console.log("Mongo error",err)
    }
})
module.exports=route;