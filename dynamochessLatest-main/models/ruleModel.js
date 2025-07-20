const mongoose=require("mongoose")

const ruleContent=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
   content:{
     type:String,
   },
   images: { type: [String], required: true },
  url:{
    type: String,
  }
})

module.exports=mongoose.model("ruleMannage",ruleContent)