const jwt=require('jsonwebtoken');
const JWT_SECRET='S@FBG/LH&H';

const fetchUser=(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"});
    }
    try {
        const data=jwt.verify(token,JWT_SECRET);
        req.admin=data.admin;
        next();
    } catch (error) {
        res.status(401).send({error:"Plaese authenticate using a valid token"});
    }
};

module.exports=fetchUser;