
const playWiithTrainer = require("../../models/PlayWithTrainerModel")

const registerForPlay = async (req, role, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: errors.array(),
            });
        }



    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const createTrainer = async (req, role, res) => {
    try {

     const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: errors.array(),
            });
        }
        

    } catch (error) {

    }
}