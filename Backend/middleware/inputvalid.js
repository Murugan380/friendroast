const Joi=require("joi");
const userdatavalidate=Joi.object({
    name:Joi.string().min(4).required(),
    password:Joi.string().min(8).required(),
})
const chatdatavalidate=Joi.object({
    frdname:Joi.string().min(4).required()
})
const chatad=Joi.object({
    frdmessage:Joi.string().required()
})
module.exports={userdatavalidate,chatdatavalidate,chatad};