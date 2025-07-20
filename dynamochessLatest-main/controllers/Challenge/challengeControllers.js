const Challenge = require("../../models/ChallengeModel")
const { check, validationResult } = require("express-validator");
const PairedMatch=require("../../models/Tournament/pairedModel")
const mongoose = require('mongoose');

const User = require("../../models/userModel");

const Createchallenge = async (req, res) => {
  try {
    // console.log("iohkkjb")
    const { fromUserId, toUserId, url, challengeId } = req.body
    // console.log(fromUserId, challengeId, "hhhhh");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }
    const nameData = await User.findById(fromUserId)
    // console.log(nameData.username, "kkkkk")

    const challengeData = new Challenge({
      fromUserId,
      toUserId,
      url,
      challengerPlayerName: nameData.username,
      challengeId,
    });

    await challengeData.save();

    res.status(200).json({
      success: true,
      data: challengeData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteChallenge = async (req, res) => {
  const { challengeId } = req.params
  // console.log(challengeId, "pappapappa")
  const challenge = await Challenge.findById(challengeId)
  if (!challenge) {
    return res.status(404).json({
      success: false,
      message: "challenge not found"
    })
  }
  await Challenge.deleteOne()
  res.status(200).json({
    success: true,
    data: challenge
  })
}

const notification = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is not provided" });
    }

    // Fetch paired matches where the user is player1 or player2
    // const pairedMatches = await PairedMatch.find({
    //   $or: [{ player1: userId }, { player2: userId }]
    // });

    // Fetch the latest 5 notifications for the user
    const notifications = await Challenge.find({ toUserId: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      notifications,
  
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const pairedPlayer = async (req, res) => {
try {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is not provided" });
  }

  // Fetch paired matches where the user is player1 or player2
  const pairedMatches = await PairedMatch.find({
    $or: [{ player1: userId }, { player2: userId }]
  });
  if(pairedMatches){
    res.status(200).json({
      success: true,
      pairedMatches:pairedMatches
    
  
    });
  }else{
    res.status(400).json({
      success:false,
      message:"No paired matches found"
    })
  }


  




} catch (error) {
  console.error( error);
  res.status(500).json({ success: false, message: "Server error", error });
}}






module.exports = {
  Createchallenge,
  deleteChallenge,
  notification,
  pairedPlayer
}
