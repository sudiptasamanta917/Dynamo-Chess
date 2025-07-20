const Post=require("../../models/postModel")
const { check, validationResult } = require("express-validator");

const createPost=async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
          });
        }
        const {title,body,geoLocation}=req.body
        console.log(title)
        let userId=req.user
        console.log(userId,"fffffffffffffffff")
     
        const post=new Post({
            title,
            body,
            geoLocation,
              createdBy:userId
          
        })
        await post.save()
        res.status(200).json({
            success:true,
            data:post
        })
        
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
const getPost=async(req,res)=>{
    try {
        console.group("hiiii")
        const {postId}=req.params
        const post=await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }
        res.status(200).json({
            success:true,
            data:post
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
const deletePost=async(req,res)=>{
    try {
        const {postId}=req.params
        const post=await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }
        await post.deleteOne()
        res.status(200).json({
            success:true,
            data:post
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
const updatePost=async(req,res)=>{
const {postId}=req.params
const data=req.body
const updatedPost=await Post.findByIdAndUpdate(postId,data,
    {
        new:true
    }
)

res.status(200).json({
    success:true,
    data:updatedPost,
})

}
const getAllPost=async(req,res)=>{
    try {
        const posts=await Post.find()
        res.status(200).json({
            success:true,
            data:posts
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
const getPostByLatLong = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        console.log(typeof latitude)
        const posts = await Post.find({
            geoLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000 // Adjust distance in meters if needed
                }
            }
        });

        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
const getActiveUser=async(req,res)=>{
    try {
        const getAllData= await Post.find()
        const activeUsers= getAllData.filter((data)=>{
            return data.active==true
        })
        res.status(200).json({
            success:true,
            count:activeUsers.length
        })
        
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
const getInActiveUser=async(req,res)=>{
    try {
        const getAllData= await Post.find()
        const InactiveUsers= getAllData.filter((data)=>{
            return data.active==false
        })
        res.status(200).json({
            success:true,
            count:InactiveUsers.length
        })
        
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
module.exports={
    createPost,
    getPost,
    deletePost,
    updatePost,
    getAllPost,
    getPostByLatLong,
    getActiveUser,
    getInActiveUser
}