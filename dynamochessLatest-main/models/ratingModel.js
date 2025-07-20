const mongoose=require("mongoose")

const Rating=mongoose.Schema(
    {
        rating:{
            type:String,
            
        },
        messages:{
            type:String,
           
        },
        user:{
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        date:{
            type:Date,
            default:Date.now,
           
        },
        userName:{
            type:String,  
        }

    },
    { versionKey: false }
)
module.exports=mongoose.model("Rating",Rating)