/**
 * use this api- http://localhost:3000/api/user/register with http POST request to register/signup user to the database.
 * the request body should be in this format---
 *  {
 *     firstName:'Souvik',
 *    lastName:'Dey',
 *     email:'sd@gmail.com',
 *     password:'sd25@123',
 *     pic:'url of photo'
 *  }
 * on successful registration this api will return a responce body of stored user object in mongoDB with addition jwt token field.
 **/




const connectDB = require('../../../config/db.js')
const User=require('../../../models/userModel.js')
const generateToken =require('../../../config/generateToken.js')

async function handler(req, res) {
//connecting to the mongoDB database first when request comes...
  await connectDB().catch(error=>res.status(500).json({error:'connection falied with mongoDB...'}))
  
  if(req.method=='POST'){
    const user=JSON.parse(req.body)
    const {firstName,lastName,email,password,pic}=user
    
    if(!firstName||!lastName||!email||!password){
      return res.status(400).json({error:'some registration detail is missing...'})
    }
    //checking if user is already exist or not...
    const existUser=await User.findOne({email:email})
    if(existUser){
      return res.status(400).json({error:'user is already exists...'})
    }
    //creating a new user to the database...
    const result=await User.create({
      firstName,
      lastName,
      email,
      password,
      
    })

    if(result){
      return res.status(200).send({
        _id:result._id,
        firstName:result.firstName,
        lastName:result.lastName,
        email:result.email,
        pic:result.pic,
        token:generateToken(result._id)  //this function generate a jwt(json web token) token when user is successfully created.
                                         // jwt is basically helps to authorize user in the backend.
      })                                 
    }
    else{
      return res.status(400).json({error:'Failed to create a user...'})
    }
    
  }
  else{
    res.status(404).json({error:'Not a valid http method on this route..'})
  }
 

}

  export default handler  