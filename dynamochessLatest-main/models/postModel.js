const mongoose =require("mongoose")

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    active: { type: Boolean, default: true },

    geoLocation: {
        coordinates: {
            type: [Number],
            default: [null, null],
        },
    },

},
    {
        timestamps: true
    }
);

module.exports=mongoose.model("Post",PostSchema)