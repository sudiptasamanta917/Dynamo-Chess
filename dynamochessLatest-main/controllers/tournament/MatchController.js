// const Match = require("../../models/matchModel")
// const Tournament = require("../../models/tournamentModel")
// const User = require("../../models/userModel")

// const createRunningMatch = async (req, res) => {
//     try {
//         const { player1Email, player2Email, gameType, resutStatus } = req.body
//         const newMatch = new Match({
//             player1Email,
//             player2Email,
//             gameType,
//             resutStatus
//         })
//         await newMatch.save()

//         res.status(200).json({
//             success: true,
//             message: "match created",
//             data: newMatch
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message,
//         })
//     }
// }
// const getPostMatchDetails = async (req, res) => {
//     try {
//         const matchId = req.params.id
//         const matchDetails = await Match.findById(matchId)
//         if (!matchDetails) {
//             return res.status(400).json({
//                 success: false,
//                 message: "match not found"
//             })
//         }

//         res.status(200).json({
//             success: true,
//             data: matchDetails
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message,
//         })
//     }
// }
// const createWinnerMatchData = async (req, res) => {
//     try {
//         const { winnerEmail, loserEmail, matchId } = req.body
//         const matchDetails = await Match.findById(matchId)
//         if (!matchDetails) {
//             return res.status(400).json({
//                 success: false,
//                 message: "match not found"
//             })
//         }
//         matchDetails.winnerEmail = winnerEmail
//         matchDetails.loserEmail = loserEmail
//         matchDetails.resutStatus="matchEnd"
//         await matchDetails.save()
//         res.status(200).json({
//             success: true,
//             data: matchDetails
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message,
//         })
//     }
// }
// const getMyResult=async(req,res)=>{
//     try{
//         const email=req.params.email
//         const matchDetails=await Match.find({email})
//         if(!matchDetails){
//             return res.status(400).json({
//                 success:false,
//                 message:"match not found"
//             })
//         }
//         console.log(matchDetails)
//         res.status(200).json({
//             success:true,
//             data:matchDetails
//         })
//     }catch(error){
//         res.status(400).json({
//             success:false,
//             message:error.message,
//         })
//     }
// }
//  module.exports = {
//         createRunningMatch,
//         createWinnerMatchData,
//         getPostMatchDetails,
//         getMyResult
// }