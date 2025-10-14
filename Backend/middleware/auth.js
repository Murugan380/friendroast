const jwt=require("jsonwebtoken");
function auth(req,res,next){
    const head=req.headers['authorization'];
    if(!head)return res.status(401).send({message:"Token missing"})
    const token=head.split(' ')[1];
    jwt.verify(token,process.env.KEY,(error,decoded)=>{
        if(error)return res.status(403).send({message:"Invalid Token"})
        req.user=decoded;
        next();
    })
}
module.exports=auth;