const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
//this is the user schema.
const userSchema=mongoose.Schema(
    {
        firstName:{type:String,required:true},
        lastName:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        pic:{type:String,default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBxkWPjMhg6KA1wPseVi539U7-kWiB3aRdaGKf1hw6hbTjk18&s'}
    },{
        timestamps:true
    }
)




userSchema.pre("save",async function (next){
   if(!this.isModified){
    next()
   }
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})

const User=mongoose.models.User || mongoose.model("User",userSchema)

module.exports=User