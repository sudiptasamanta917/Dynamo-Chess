const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
    {      
        tournamentName: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        entryFees: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        topThreePlayer: {
            type: [String]
        },
        JoinedPlayerList:{
            type: [Object]
        },
        tournamentIsJoin:{
            type:Boolean,
            default:false
        },
        noOfRounds:{
            type:Number
        },
        noOfplayers:{
            type:Number,
            default:10
        },
        createdBy:{
            type: String,
            required: true
        },
        status:{
            type: String,
            default:"Pending"
        }
    },
    { versionKey: false }
);

module.exports = mongoose.model("Tournament", tournamentSchema);
