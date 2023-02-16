/**
 * API- http://localhost:3000/api/chat/group/groupadd
 * this api is used to add a user from a group chat through put request..
 * Request body contains user id(mongoDB user object _id) and target the group chat id(mongoDB chat object _id).
 * request body example:
 *  {
 *    addUserID: '88879bjhf00230323',
 *    chatID: '2434jrh354545466543' 
 *  }
 * 
 * First of all to use this api set Bearer token with the user object token value in the request header. as 
 * this api route is protected with authentication
 */



const connectDB = require('../../../../config/db.js')
const Chat=require('../../../../models/chatModel.js')
import protectRoute from '../../../../config/authorization.js'

async function handler(req, res) {
    //connecting to the mongoDB database first when request comes...
      await connectDB().catch(error=>res.status(500).json({error:'connection falied with mongoDB...'}))

    //checking user authentication to access this api route...
      await protectRoute(req,res).catch(error=>res.status(500).json({error:'user authorization failed/user is not authorized...'}))
       
      const {addUserID,chatID}=JSON.parse(req.body)

      
      if(!addUserID || !chatID){
        return res.status(400).json({error:'chat group id or user id is missing...'})
      }


      const result=await Chat.findByIdAndUpdate({_id:chatID},{$push:{'users':addUserID}},{new:true})
         .populate('users','-password')
         .populate('groupAdmin','-password')

      if(!result){
        return res.status(400).json({error:'add user to group chat failed...'})
      }   
      
      return res.status(200).send(result)
      
    }
    
export default handler  