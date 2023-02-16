const mongoose=require('mongoose')


//this is the Chat schema.
const chatSchema=mongoose.Schema(
    {
        chatName:{type:String,trim:true},
        groupChat:{type:Boolean,default:false},
        users:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
        latestMessage:{type:mongoose.Schema.Types.ObjectId,ref:"Message"},
        groupAdmin:{type:mongoose.Schema.Types.ObjectId,ref:"User"},

    },
    {
        timestamps:true
    }
)

const Chat=mongoose.models.Chat || mongoose.model("Chat",chatSchema)
module.exports=Chat