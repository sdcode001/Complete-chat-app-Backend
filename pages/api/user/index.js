/**
 * First of all to use this api set Bearer token with the user object token value in the request header. as 
 * this api route is protected with authentication
 
 * This api is- http://localhost:3000/api/user/?search=<keyword>
 * this api is used to search register users and get all of them from mongoDB database. 
 * user this api with two query parameters: 
 *   keyword= search word, it can be firstname or lastname or email.
 */


const connectDB = require('../../../config/db.js')
const User=require('../../../models/userModel.js')
import protectRoute from '../../../config/authorization.js'

async function handler(req, res) {
    //connecting to the mongoDB database first when request comes...
      await connectDB().catch(error=>res.status(500).json({error:'connection falied with mongoDB...'}))

    //checking user authentication to access this api route...
      await protectRoute(req,res).catch(error=>res.status(500).json({error:'user authorization failed/user is not authorized...'}))

      const searchWord=req.query.search?{
          $or: [
            {firstName:{ $regex:req.query.search, $options:"i"}},
            {lastName:{ $regex:req.query.search, $options:"i"}},
            {email:{ $regex:req.query.search, $options:""}}
          ]
      }:{}
      
      const result=await User.find(searchWord).find({_id:{$ne: req.user._id}}).select('-password')
      
      if(result){
        return res.status(200).send(result)
      }
      else{return res.status(400).json({error:'no user found...'})}
      
    }
    
export default handler  