

const Time =require("../../models/TimeModel")
const { check, validationResult } = require("express-validator");
const getTime=async(req,role,res)=>{
    try {
        // const {title}=req.body
        const time=await Time.find({})
        // console.log(time)
        res.status(200).json({
            success:true,
            data:time
        })
    } catch (error) {
         res.status(400).json({
            success:false,
            message:error.message
        }) 
    }
}

const setTime=async(req,role,res)=>{
    try {
        const {title,time1,time2,time3}=req.body
        const data=await Time.findOne({title})
        // console.log(data)
        if(data){
            const updatedTime = await Time.findOneAndUpdate(
                { title },  // Find document by title
                {  time1, time2, time3 },   // Update the time field
                { new: true, upsert: true }  // Return the updated document and create if it doesn't exist
            );
            res.status(200).json({
                success: true,
                data: updatedTime
            });   
        }else{
            const newTime=await Time.create(req.body)
            res.status(200).json({
                success:true,
                data:newTime
            })
        }
     
     
    } catch (error) {
         res.status(400).json({
            success:false,
            message:error.message
        })
    }
  
}
module.exports={
getTime,
setTime
}