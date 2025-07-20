const mongoose = require("mongoose");
const playerSchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: true
       
    },
    name: {
        type: String,
        trim: true,
    },
    socketID: {
        type: String,
    },
    totalPoint: {
        type: Number,
        default: 0,
    },
  
    profileImageUrl: {
        required: true,
        type: String,
    },
    playerStatus: {
        type: String,
    },
    colour: {
        type: String,
    },
    strikeDone:{
        type:Boolean,
        default:false,
    },
    countryicon:{
        type: String,
        required: true,
      },
    Rating:{
        type: Number,
      },
     
    
}, { versionKey: false })
module.exports = playerSchema;