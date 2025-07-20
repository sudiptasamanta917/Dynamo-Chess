const mongoose=require("mongoose")

const Trainer=mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        age:{
            type:Number,
            required:true
        },
        // email:{
        //     type:String,
        //     required:true
        // },
        // gender:{
        //     type:String,
        //     required:true
        // },
        address:{
            type:String,
            required:true
        },
        content:{
            type:String,
          
        },
        // qualification:{
        //     type:String,
            
        // },
        experience:{
            type:String,
           
        },
        // about:{
        //     type:String,
         
        // },
        image:{
            type:String,
        },
        language:{
            type:String,
        },
        feesPerHour:{
            type:String,
        }
    }
)

module.exports=mongoose.model("Trainer",Trainer)