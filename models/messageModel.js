const mongoose=require('mongoose')


//this is the message schema.
const messageSchema=mongoose.Schema(
    {
       sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
       content:{type:String,trim:true},
       chat:{type:mongoose.Schema.Types.ObjectId,ref:"Chat"}
    },
    {
      timestamps:true
    }
)

const Message=mongoose.models.Message || mongoose.model("Message",messageSchema)

module.exports=Message