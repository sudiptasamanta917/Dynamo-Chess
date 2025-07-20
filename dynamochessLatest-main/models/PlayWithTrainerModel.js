const mongoose=require("mongoose")

const playWithTrainer=new Schema(
{
    trainerName:{
        type:String,
        required:true
    },
     trainerPhone:{
        type:String,
        required:true
    },
    joiningfees:{
        type:Number,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    setDate:{
        type:String,
        required:true
    },
    setTime:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true
    },
    connectOnline:{
        type:String,
        required:true
    },
    connectAtAcademy:{
        type:String,
        required:true
    },
}
)

module.exports=mongoose.model( "playeWithTrainer",playWithTrainer)