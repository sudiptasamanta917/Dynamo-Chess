const mongoose = require("mongoose");
const Analysis = require("../../models/Analysis");

const getAnalysisByUserId = async (req, res) => { 
    try {
        const { playerId } = req.params;
        // console.log("Player ID:", playerId);

        const allData = await Analysis.aggregate([
            { $match: { "analysisData.players.playerId": playerId } },
            { $unwind: "$analysisData" },
            { $match: { "analysisData.players.playerId": playerId } },
            { $group: { _id: "$_id", analysisData: { $push: "$analysisData" } } }
        ]);

        // console.log("Filtered Data:", allData);

        res.status(200).json({
            success: true,
            data: allData
        });
    } catch (error) {
        console.error("Error fetching analysis data:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching analysis data."
        });
    }
};



const getAnalysisBoardByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log("jjj")

    // Validate roomId as ObjectId
    // if (!mongoose.Types.ObjectId.isValid(roomId)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid room ID.",
    //   });
    // }

    // Find matching data in the database
    const data = await Analysis.find({
      "analysisData._id": roomId,
    });

    // Check if data exists
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No analysis data found for the given room ID.",
      });
    }

    // Return the matching data
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching analysis board data:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching analysis board data.",
      error: error.message,
    });
  }
};


module.exports = {
    getAnalysisByUserId,
    getAnalysisBoardByRoomId
};
