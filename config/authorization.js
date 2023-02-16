const User=require('../models/userModel.js')
const jwt=require('jsonwebtoken')


async function protectRoute(req,res){
     let token
     
     if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
           token=req.headers.authorization.split(" ")[1]
           //decodes token into _id
           const decode=jwt.verify(token,process.env.JWT_SECRET)
           const result=await User.findById(decode.id).select("-password")
           if(!result){
              res.status(400).json({error:'user authorization failed/user is not authorized'})
           }
           //if user is authorized then attach the user object with the request...
           req.user=result
        }catch(err){
            res.status(400).json({error:'user authorization failed/user is not authorized'})
            throw new Error(err.message) 
        }
     }
     
     if(!token){
        res.status(401).json({error:'user authorization failed/user is not authorized'})
        throw new Error('user authorization failed/user is not authorized') 
     }
}


export default protectRoute