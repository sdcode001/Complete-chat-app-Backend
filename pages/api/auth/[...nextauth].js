/**
 * We use NextAuth.JS for user login with credentials(email, password). Use Next-Auth in the client side in 
 * the respective page. use signin() function with 'credentials' field the that page for login with email and
 * password.
 **/ 

import NextAuth from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
const connectDB = require('../../../config/db.js')
const User=require('../../../models/userModel.js')
const bcrypt=require('bcryptjs')
const generateToken =require('../../../config/generateToken.js')


export default NextAuth({
   providers:[

      CredentialProvider({
        name:'Credentials',
        async authorize(credentials,req){  //this function will handle session cookies once user authorize successfully...
          //connecting to the mongoDB database first when request comes...
           await connectDB().catch(error=>res.status(500).json({error:'connection falied with mongoDB...'}))
           
           //checking user is exists on database or not...
           const result=await User.findOne({email:credentials.email})
           
           async function matchPassword(enteredPassword,encryptedPassword){
            return await bcrypt.compare(enteredPassword,encryptedPassword)
           }

           if(result && (await matchPassword(credentials.password,result.password))){
            return {
               _id:result._id,
               firstName:result.firstName,
               lastName:result.lastName,
               email:result.email,
               pic:result.pic,
               token:generateToken(result._id)  //this function generate a jwt(json web token) token when user is successfully created.
             }
           }
           else{
            throw new Error('SignIn failed-user is not registered/wrong password...')
           }

        }
      })
   ]
})









// async function handler(req, res) {
// //connecting to the mongoDB database first when request comes...
//   await connectDB().catch(error=>res.status(500).json({error:'connection falied with mongoDB...'}))
  
//   if(req.method=='POST'){
//     const userCred=JSON.parse(req.body)
//     const {email,password}=userCred

//     //checking user is exists on database or not...
//     const result=await User.findOne({email:email})

//     async function matchPassword(enteredPassword,encryptedPassword){
//         return await bcrypt.compare(enteredPassword,encryptedPassword)
//     }
 
//     if(result && (await matchPassword(password,result.password))){
//         return res.status(201).json({
//             _id:result._id,
//             firstName:result.firstName,
//             lastName:result.lastName,
//             email:result.email,
//             pic:result.pic,
//             token:generateToken(result._id)  //this function generate a jwt(json web token) token when user is successfully created.
//           })                                 // jwt is basically helps to authorize user in the backend.
//         }
//     else{
//        return res.status(400).json({error:'Failed to signIn user...'})
//     }
//   }
//   else{
//     res.status(404).json({error:'Not a valid http method on this route..'})
//   }
 

// }

 // export default handler  