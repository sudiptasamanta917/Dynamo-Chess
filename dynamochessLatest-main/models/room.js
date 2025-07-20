const mongoose = require("mongoose");
const playerSchema = require("./player");
const roomSchema = new mongoose.Schema({
    _id: {
        type: String, // Set `_id` to use `joinId`
      },

    occupancy: {
        type: Number,
        default: 0,
    },

    isJoin: {
        type: Boolean,
        default: true,
    },
    players: [playerSchema],
    allBoardData: {
        type: []
    },
    allBoardData1:{
        type:Object,
        default: {},
    },
    allBoardData2:{
      type:Object,
      default: {},
    },
    currentIndex:{
        type: Number,
        default: 0,
    },
    moveList: {
      type: [String]
    },
    board: {
        type: Object
    },
    coin: {
        type: Number,
    },

    timer1: {
        type: Number,
        default: 0,
    },

    timer2: {
        type: Number,
        default: 0,
    },

    stopTimer1: {
        type: Boolean,
        default: false,
    },

    stopTimer2: {
        type: Boolean,
        default: false,
    },
    nextplayer: {
        type: String,
    },
    nextPlayerColor:{
        type: String,
    },
    timer:{
        type: Number,
        default: 300,
    },
    playerList:{
        type:Array,
        default:[]
    },
    isLeftPLayer1:{
        type:Boolean,
        default:false
    },
    isLeftPLayer2:{
        type:Boolean,
        default:false
    },
    DrawStatus:{
        type:Boolean,
        default:false,
    },
    threeFlag:{
        type:Boolean,
        default:false,
    },
    fiveFlag:{
        type:Boolean,
        default:false,
    },
    pairCounts: {
        type: Map,
        of: Number,
        default: {}
    },
    joinId:{
    type:String,
   },
   threefoldCount:{
    type:Number,
    default:0
   },
   repetationArray:{
    type: Array,
    default:[]
   },
   createdAt:{
    type: Date,
    default: Date.now
   },
   winner:{
    type: String
   },
   checkMate:{
    type: Boolean,
    default: false
   },
   turnBackPlayer:{
    type: String,
   },
   turnBackPlayerColor:{
    type: String,
   },
   lastTimerUpdate:{
    type: Date,
   
   }
  

}, { versionKey: false })

const roomModel = mongoose.model("chess-Room", roomSchema);
module.exports = roomModel;