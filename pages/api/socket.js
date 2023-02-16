/** use this function on the frontend page to connect with the socket server inside useEffect react hook.
 
    import  io  from 'socket.io-client'
     let socket

    const socketInitializer=async ()=>{
        await fetch('/api/socket')
        socket=io()
      }
 */



import { Server } from 'socket.io'


function handler(req, res) {
 if(res.socket.server.io){
   console.log('Socket is already running....')
  }else{
     console.log('Socket is initializing....')
     const io=new Server(res.socket.server)
     res.socket.server.io=io

     io.on('connection',(socket)=>{
        
      /** this socket event is used to join user in his own room with his user _id
          so that when messages comes from any chat then the message can be emit 
          to the room.

          In the frontend page use 'setup' event with user object and emit the event ie: socket.emit('setup',user) inside
          a react hook when user starts the application for the first time.
          and also catch the event 'connected' in the frontend page sent from this event socket after user 
          joined room ie: socket.on('connected'()=>{ })
      */
      socket.on('setup',(userData)=>{
        console.log(`user ${userData._id} connected...`)
        socket.join(userData._id)
        socket.emit('connected')
      })

      /** this socket event is used to join user in a chat room of the chatID.
          when user click on any chat in the frontend page then this socket event join the user 
          in the particular chat room.

          In the frontend page use 'join-chat' event with user chatID from the chat object and emit the event ie: socket.emit('join-chat',chat._id) inside
          a react hook when user click on a chat.
      */
      socket.on('join-chat',(chatID)=>{
        socket.join(chatID)
        console.log(`user joined room: ${chatID}`)
      })

      /** this socket event is used to recieve a new message and send it to the other users of the
          chat where the message is sent to.
          In the frontend page use 'new-message' event with message object and emit the event ie: socket.emit('',newMessage) after the message 
          object is post to the mongodb this newMessage object is the object recieved after post request from mongodb.
          Also catch the event 'message-recieved' in the frontend page sent from this event socket to the other users of the message chat ie: socket.on('message-recieved',(newRecievedMessage)=>{ })
      */
      socket.on('new-message',(newMessage)=>{
        const chat=newMessage.chat
        if(!chat.users){return console.log('chat users not defined...')}
        chat.users.forEach((user) => {
          if(user._id==newMessage.sender._id){return}
          socket.in(user._id).emit('message-recieved',newMessage)
        });
      })


    

       socket.on('disconnect',()=>{
          console.log(`client ${socket.id} disconnected.....`)
       })

     })
    }
  
res.end()
}



export default handler