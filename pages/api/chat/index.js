//API- http://localhost:3000/api/chat
//For POST request: this api is used to fetch/create one to one (between current user and userID) chat
//For GET request: this api is used to fetch all the chats of the current user
/**
 * First of all to use this api set Bearer token with the user object token value in the request header. as 
 * this api route is protected with authentication 
 * post request body example:
 *  {
 *   userID: '3239df898939efd9899'
 *  }
 * 
 * For one-to-one chat here we are keeping chat name as sender but in the frontend we shold set the chat name
 * as the opposite of the current user from the users list of two users
 * 
 * */

const connectDB = require('../../../config/db.js')
const User=require('../../../models/userModel.js')
const Chat=require('../../../models/chatModel.js')
import protectRoute from '../../../config/authorization.js'



async function handler(req, res) {
    //connecting to the mongoDB database first when request comes...
      await connectDB().catch(error=>res.status(500).json({error:'connection falied with mongoDB...'}))

    //checking user authentication to access this api route...
      await protectRoute(req,res).catch(error=>res.status(500).json({error:'user authorization failed/user is not authorized...'}))
    
      if(req.method=='POST'){
        const {userID}=JSON.parse(req.body) //userID of the user with whom current user have a chat.

      if(!userID){
        return res.status(400).json({error:'userID is missing from request body...'})
      }

      var isChat=await Chat.find({
                 isGroupChat:false,
                 $and:[
                    {users:{$elemMatch:{$eq:req.user._id}}},
                    {users:{$elemMatch:{$eq:userID}}}
                 ]
      }).populate('users','-password').populate('latestMessage')

      isChat=await User.populate(isChat,{
        path:'latestMessage.sender',
        select:'name pic email'
      })

      if(isChat.length>0){
        return res.send(isChat[0])
      }
      else{
         var chatData={
            chatName:'sender',
            isGroupChat:false,
            users:[req.user._id,userID]
         }

         try{
           const createdChat=await Chat.create(chatData)
           const fullChatData=await Chat.findOne({_id:createdChat._id}).populate('users','-password')
           return res.status(200).send(fullChatData)
         }catch(err){
            throw new Error(err.message)
         }
      }
    }
    else if(req.method=='GET'){
       try{
          Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
          .populate('users','-password')
          .populate('groupAdmin','-password')
          .populate('latestMessage')
          .sort({updatedAt:-1})
          .then(async (results)=>{
             results=await User.populate(results,{
                path:'latestMessage.sender',
                select:'name pic email'
              })
              
              return res.status(200).send(results)
          })
        
       }catch(err){
         throw new Error(err.message)
       }
    }
    else{
        return res.status(400).json({error:'wrong http method on this api...'})
    }

      
      
    }
    
export default handler 



