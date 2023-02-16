//For post request API- http://localhost:3000/api/message
//For get request API example- http://localhost:3000/api/message?chatID=89685hfdj984984998'
//For POST request: this api is used to post a new message on database on respective chat 
//For GET request: this api is used to fetch all the messages of a chat with chatID provided on request query.
/**
 * First of all to use this api set Bearer token with the user object token value in the request header. as 
 * this api route is protected with authentication 
 * 
 * post request body example:
 *  {
 *     content:"Hello there."
 *     chatID: "9667588fjjfj4u48484"
 *  }
 * 
 * get request query parameter example:
 *  chatID = 398988sdjhsjd3923
 * 
 * */

const connectDB = require('../../../config/db.js')
const User=require('../../../models/userModel.js')
const Message=require('../../../models/messageModel.js')
const Chat=require('../../../models/chatModel.js')
import protectRoute from '../../../config/authorization.js'

async function handler(req, res) {
    //connecting to the mongoDB database first when request comes...
      await connectDB().catch(error=>res.status(500).json({error:'connection falied with mongoDB...'}))

    //checking user authentication to access this api route...
      await protectRoute(req,res).catch(error=>res.status(500).json({error:'user authorization failed/user is not authorized...'}))

      if(req.method=='POST'){
        const {content,chatID}=JSON.parse(req.body)

        if(!content || !chatID){
            return res.status(400).json({error:'content/chatID is missing...'})
        }

        var newMessage={
            sender:req.user._id,
            content:content,
            chat:chatID
        }
         
        try{
          var message=await Message.create(newMessage)
          message=await message.populate('sender','-password -email')
          message=await message.populate('chat')
          message=await User.populate(message,{
            path:'chat.users',select:'-password '
          })

          await Chat.findByIdAndUpdate(chatID,{latestMessage:message},{new:true})
          return res.status(201).json(message)
        }catch(err){
          res.status(400)
          throw new Error(err.message)
        }
      }
      else if(req.method=='GET'){
        const chatID=req.query.chatID
        try{
            const messages=await Message.find({chat:chatID})
            .populate('sender','-password')
            .populate('chat')
            return res.status(200).send(messages)
        }catch(err){
            return res.status(400)
            throw new Error(err.message)
        }
      }
      else{
        return res.status(400).json({error:'Wrong http method on this route...'})
      }
      
    }
    
export default handler  
