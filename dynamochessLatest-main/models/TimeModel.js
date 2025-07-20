
const mongoose=require("mongoose")

const time = mongoose.Schema(
    {      
     
   time1:{
    type: String,
    required: true,
   },
   title:{
    type: String,
    required: true,
   },
   time2:{
    type: String,
    required: true,
   },
   time3:{
    type: String,
    required: true,
   }

    },
    { versionKey: false }
)

module.exports=mongoose.model("TimeMannage",time)