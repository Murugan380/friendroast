const mongoose=require("mongoose");
const usershema=new mongoose.Schema({
    name:String,
    password:String,
    profile:String,
    createdAt:{type:Date,default:Date.now}
});
const user=mongoose.model("user",usershema);

const userchatshema=new mongoose.Schema({
    userid:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    frdname:String,
    messageId:{type:mongoose.Schema.Types.ObjectId,ref:"chat"},
    createdAt:{type:Date,default:Date.now}
})
const userchat=mongoose.model("userchat",userchatshema);
const chatshema=new mongoose.Schema({
    frdmessage:String
})
const chat=mongoose.model("chat",chatshema);
module.exports={user,mongoose,chat,userchat};