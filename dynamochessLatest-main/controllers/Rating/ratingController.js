const Rating = require("../../models/ratingModel");
const { validationResult } = require("express-validator");

const User = require("../../models/userModel");

const createRating = async (req, res) => {
    try {
        const errors = validationResult(req);
        const { rating, messages } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: errors.array(),
            });
        }

        const user = await User.findById(req.user._id);
        let name=user.name
        // console.log(name,"kkkkk")
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newData = {
            user: req.user._id,
            rating: rating,
            messages: messages,
            date: req.body.date || Date.now(),
            userName: name
        };

        const newRating = new Rating(newData); // Corrected variable name
        await newRating.save(); // Call save on newRating

        res.status(200).json({
            success: true,
            message: "Rating created successfully",
            rating: newRating // Return the newRating object
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({});
        if (!ratings || ratings.length === 0) {
            return res.status(404).json({ message: "Ratings not found" });
        }
        
        // console.log(ratings);

        // Calculate the average rating
        const totalRatings = ratings.reduce((sum, rating) => sum + parseFloat(rating.rating), 0);
        const averageRating = totalRatings / ratings.length;

        res.status(200).json({
            success: true,
            ratings: ratings,
            averageRating: averageRating.toFixed(2) // limiting the average rating to 2 decimal places
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRating=async(req,res)=>{
    try {
        const rating = await Rating.findById(req.params.id);
        if (!rating) {
            return res.status(404).json({ message: "Rating not found" });
        }
        await Rating.deleteOne({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: "Rating deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createRating,getRatings,deleteRating };
