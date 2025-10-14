const express=require("express");
const route=express.Router();
const fs = require("fs");
const path = require("path");
const multer=require("multer")
const upload=require("../../middleware/multer")
const {user,chat,userchat}=require("../../Shema/shema");
const auth=require("../../middleware/auth");
const {chatdatavalidate}=require('../../middleware/inputvalid')
route.post('/file', auth, async (req, res) => {
  upload.single("profile")(req, res, async (err) => {
    try {
      // ✅ Handle Multer errors first
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            console.log("multer", err);
            return res.status(400).send({ message: "Max 2MB allowed" });
          } else {
            console.log("multer", err);
            return res.status(400).send({ message: err.message });
          }
        } else {
          // Non-multer error
          console.log("Upload error:", err);
          return res.status(400).send({ message: err.message });
        }
      }

      // ✅ Ensure a file was uploaded
      if (!req.file) {
        return res.status(400).send({ message: "No file uploaded" });
      }
      const getfile=await user.findOne({_id:req.user.id});
      if(!getfile.profile)
        {
           console.log(getfile)
        }else{
        console.log("getpro",getfile.profile);
        const filePath = path.join(__dirname, "../../ProfileIMG", getfile.profile);
        fs.unlink(filePath,(err)=>{
            if(err) return (console.log("fdelete",err),res.status(400).send({message:"There is an error"}));
            else{
                console.log("file deleted")
            }
           
        })
      }

      // ✅ Update user profile image
      const result = await user.findOneAndUpdate(
        { _id: req.user.id },
        { $set: { profile: req.file.filename } },
        { new: true }
      );

      if (result) {
        console.log("Uploaded:", req.file.fieldname);
        return res.send(req.file.filename);
      } else {
        return res.status(400).send({ message: "Error updating user profile" });
      }
    } catch (err) {
      console.log("Server error:", err);
      return res.status(500).send({ message: "Server error" });
    }
  });
});

route.post('/putdata',auth,async(req,res)=>{
    const {error}=chatdatavalidate.validate(req.body);
    if(error){
        res.status(400).send({message:error.details[0].message})
    }
    try{
        const already=await userchat.findOne({frdname:req.body.frdname});
        if(already) return (console.log("alll",already),res.send(already));
        const msg=await chat.find({})
        let rand;
        if(msg){
            rand=msg[Math.floor(Math.random()*msg.length)]
            console.log(rand);
        }
        const result=await userchat.insertOne({userid:req.user.id,frdname:req.body.frdname,messageId:rand._id})
        if(result){
            console.log({"result":result,"frdname":rand.frdmessage});
            res.send({"result":result,"messageId":{"frdmessage":rand.frdmessage}});
        }
    }
    catch(err){
        console.log("Error mongo",err)
    }
})
route.post('/getdata',auth,async(req,res)=>{
    try{
        const result=await userchat.find({userid:req.user.id}).populate('messageId','frdmessage').populate('userid');
        if(result.length>0){
            console.log("result",result)
            res.send(result);
        }
    }
    catch(err){
        console.log("Mongo err",err)
    }
});
route.post('/getuserd',auth,async(req,res)=>{
    try{
         const result=await user.findOne({_id:req.user.id});
            console.log("result2",result.profile)
            res.send(result)
    }
    catch(err){
        console.log(err);
    }
})
route.post('/deldata',auth,async(req,res)=>{
    try{
        console.log(req.body.body)
       const date=req.body.body
       const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
       const result=await userchat.deleteMany({userid:req.user.id, createdAt: { $gte: start, $lte: end }})
       console.log(result)
       if(result.deletedCount>0){
        res.send({message:req.body})
       }
    }
    catch(err){
        console.log("Mongo",err)
    }
})
module.exports=route;