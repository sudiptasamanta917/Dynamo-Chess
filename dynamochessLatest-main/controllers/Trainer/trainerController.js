const Trainer = require("../../models/trainerModel");

const { check, validationResult } = require("express-validator");
const User = require("../../models/userModel");

const CreateTrainer = async (req, res) => {
  try {
    const { name, age, content, experience, address, language, feesPerHour } =
      req.body;

    if (!req.file || !req.file.filename) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const image = req.file.filename;
    console.log(`Uploaded image: ${image}`);
    console.log(
      `Uploaded data: ${
        (name, age, address, content, experience, language, feesPerHour)
      }`
    );

    const newTrainer = new Trainer({
      name,
      age,
      content,
      experience,
      image,
      address,
      language,
      feesPerHour,
    });

    await newTrainer.save();
    res.status(200).json({ success: true, data: newTrainer });
  } catch (error) {
    console.error("Error creating trainer:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const baseUrl = `${req.protocol}://${req.get(
      "host"
    )}/public/trainerImages/`;

    if (trainerId === "get-all") {
      const trainerData = await Trainer.find();

      // Append the image URL to each trainer
      trainerData.forEach((trainer) => {
        trainer.image = baseUrl + trainer.image;
      });

      if (!trainerData.length) {
        return res.status(400).json({
          message: "No trainers found",
        });
      }

      res.status(200).json({
        trainerData,
      });
    } else {
      const trainerData = await Trainer.findById(trainerId);

      if (!trainerData) {
        return res.status(400).json({
          message: "Trainer not found",
        });
      }

      // Append the image URL to the single trainer
      trainerData.image = baseUrl + trainerData.image;

      res.status(200).json({
        trainerData,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;
    console.log(trainerId);
    const trainerData = await Trainer.findById(trainerId);
    if (!trainerData) {
      return res.status(400).json({
        message: "Trainer not found",
      });
    }
    await Trainer.findByIdAndDelete(trainerId);
    res.status(200).json({
      message: "Trainer deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const editTrainer = async (req, res) => {
    try {
        const { trainerId } = req.params;

        // Find the existing trainer
        const existingTrainer = await Trainer.findById(trainerId);
        if (!existingTrainer) {
            return res.status(400).json({
                message: 'Trainer not found'
            });
        }

        // Extract updated fields from req.body
        const updatedFields = { ...req.body };

        // Check if a new image is uploaded
        if (req.file && req.file.filename) {
            updatedFields.image = req.file.filename;
        }

        // Update the trainer data
        const updatedTrainerData = await Trainer.findByIdAndUpdate(
            trainerId,
            updatedFields,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            data: updatedTrainerData,
            message: 'Trainer updated successfully'
        });
    } catch (error) {
        console.error("Error updating trainer:", error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

const searchUser = async (req, res) => {
  try {
    const { name } = req.query;
    console.log(name)
    const trainerData = await User.find({
      name: { $regex: name, $options: "i" },
    });
    console.log(name,trainerData)
    res.status(200).json({
      success: true,
      trainerData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  CreateTrainer,
  getTrainer,
  deleteTrainer,
  editTrainer,
  searchUser
};
