const mongoose=require("mongoose")

const deleteUserRequest=mongoose.Schema(
    {
        email: { type: String, required: true },

        name: { type: String, required: true }, // Ensure this matches the property used in your code
        description:{type:String}
},

    { versionKey: false }
)

module.exports=mongoose.model("deleteUserRequest",deleteUserRequest)