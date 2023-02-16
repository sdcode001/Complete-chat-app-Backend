/**
 * API- http://localhost:3000/api/chat/group
 * this api is used to create a group chat through post request..
 * Request body contains group name and an list of user ids(mongoDB user object _id).
 * request body example:
 *  {
 *    groupName: 'group1',
 *    users: ['4343434jfjdff4343','243njj756776766gfg4','4355jdfj456565577']
 *  }
 * 
 * First of all to use this api set Bearer token with the user object token value in the request header. as 
 * this api route is protected with authentication
 */




const connectDB = require('../../../../config/db.js')
const User=require('../../../../models/userModel.js')
const Chat=require('../../../../models/chatModel.js')
import protectRoute from '../../../../config/authorization.js'

async function handler(req, res) {
    //connecting to the mongoDB database first when request comes...
      await connectDB().catch(error=>res.status(500).json({error:'connection falied with mongoDB...'}))

    //checking user authentication to access this api route...
      await protectRoute(req,res).catch(error=>res.status(500).json({error:'user authorization failed/user is not authorized...'}))
       
      const reqBody=JSON.parse(req.body)
      if(!reqBody.groupName || !reqBody.users){
        return res.status(400).json({error:'group name or users list is missing...'})
      }

      const users=JSON.parse(reqBody.users)

      if(users.length<2){
        return res.status(400).json({error:'more than two users is expected...'})
      }

      users.push(req.user._id.toString())
      
      try{
        const chatData={
            chatName:reqBody.groupName,
            isGroupChat:true,
            users:users,
            groupAdmin:req.user
         }

         const groupChat=await Chat.create(chatData) 

         const fullGroupChat=await Chat.findOne({_id:groupChat._id})
         .populate('users','-password')
         .populate('groupAdmin','-password')

         return res.status(201).send(fullGroupChat)

      }catch(err){
          throw new Error(err.message)
      }
      
    }
    
export default handler  