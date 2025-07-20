
const MembershipModel = require("../../models/MembershipModel")
// const { validationResult } = require("express-validator");

const getMembership = async (req, res) => {
    try {
        const memberships = await MembershipModel.find();
        
        // Check if memberships were found
        if (!memberships || memberships.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No memberships found",
                data: []
            });
        }

        const baseUrl = `${req.protocol}://${req.get("host")}/public/membershipImages/`;
        const membershipsWithUrls = memberships.map(item => {
          return {
            _id: item._id,
            title: item.title,
            price: item.price,
            content: item.content,
            images: baseUrl + item.images,
          };
        });

        res.status(200).json({
            success: true,
            message: "Get memberships successfully",
            data: membershipsWithUrls
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createMembership = async (req, res) => {
    try {
        const { title, content, price } = req.body;
        const imageFiles = req.files;

        console.log(title, content, price, imageFiles, "ggggggggggg");

        if (!imageFiles || imageFiles.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No images were uploaded.",
            });
        }

        // Extract the file paths or URLs
        const imageUrls = imageFiles.map(file =>`${file.filename}`);// or file.location if using a cloud service like AWS S3

        const membership = new MembershipModel({
            title,
            content,
            price,
            images: imageUrls
        });

        const membershipData = await membership.save();

        res.status(200).json({
            success: true,
            message: "Content MembershipData successfully",
            data: membershipData
        });

    } catch (error) {
        console.log("MembershipData", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating membership.",
            error: error.message
        });
    }
};



module.exports = { getMembership,createMembership};