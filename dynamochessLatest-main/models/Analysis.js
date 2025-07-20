const mongoose=require("mongoose")

const GameAnalysis=new mongoose.Schema(
    {
        analysisData:{
            type:Array,
            default:[]
        },
        analysisData1:{
            type:Object
        },
        analysisData2:{
            type:Object
        }
    }
)

module.exports=mongoose.model("Analysis",GameAnalysis)