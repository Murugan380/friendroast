const multer= require('multer');
const path = require('path');
const uploadDir = path.join(__dirname, '../ProfileIMG');
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadDir)
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+Date.now()+Math.floor(Math.random()*9000*1000)+file.originalname)
    }
});
const filefilter=(req,file,cb)=>{
    const allowtype=/jpg|jpeg|png/;
    const extn=allowtype.test(path.extname(file.originalname));
    const mimetype=allowtype.test(file.mimetype);
    if(!(extn && mimetype)) {
        cb(new Error("Invalid File format"),false)
    }else{
        cb(null,true)
    }

}
const filesize=2*1024*1024;
const upload=multer({
    storage:storage,
    limits:{fileSize:filesize},
    fileFilter:filefilter
})
module.exports=upload;