
const Content = require("../../models/ruleModel")
const { check, validationResult } = require("express-validator");

const getRuleContent = async (req, res) => {
  try {
    const { title } = req.params;
    let content;

    if (title === "getAll") {
      content = await Content.find({});
    } else if (title === "chessMan") {
      content = await Content.find({
        title: { $in: ["The Missile", "The Rook", "The Pawn", "The Knight", "The Bishop", "The Queen", "The King"] }
      });
    } else {
      content = await Content.find({ title });
    }

    if (content.length > 0) {
      const baseUrl = `${req.protocol}://${req.get("host")}/public/rulesImages/`;
      const formattedContent = content.map(item => ({
        ...item.toObject(),
        images: item.images.map(image => `${baseUrl}${image}`),
      }));

      res.status(200).json({
        success: true,
        data: formattedContent,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No content found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const createRuleContent = async (req, role, res) => {
  try {
    const { title, content,url } = req.body;
    const imageFiles = req.files;  // Multiple files
    const imageUrls = imageFiles ? imageFiles.map(file => `${file.filename}`) : [];
    // console.log(imageUrls)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const contentData = await Content.findOne({ title });
    if (contentData) {
      const updatedContent = await Content.findOneAndUpdate(
        { title },
        { content, images: imageUrls,url },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Content updated successfully",
        data: updatedContent
      });
    } else {
      const newContent = new Content({ title, content, images: imageUrls });
      await newContent.save();
      res.status(200).json({
        success: true,
        message: "Content created successfully",
        data: newContent
      });
    }

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

const deleteRuleContent = async (req,role, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }
    // console.log("hiiiiiiiiiii");
    const { id } = req.params; // Correctly destructure id from req.params
    // console.log(id);

    // Assuming id is a unique identifier such as _id in MongoDB
    const deleteRule = await Content.findByIdAndDelete(id);
    
    if (!deleteRule) {
      return res.status(404).json({
        success: false,
        message: "No content found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Content deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const editRuleContent = async (req, res) => {
  try {
    const { id } = req.params; // Destructure id from req.params
    const updateData = req.body; // The new data to update the content with
    // console.log(`Updating content with id: ${id}`);
    // console.log('Update data:', updateData);
    // Find the content by id and update it with the new data
    const updatedContent = await Content.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        message: "No content found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Content updated successfully",
      data: updatedContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getRuleContentMultipleTitle = async (req, res) => {
  try {
    const { title } = req.body;
    let content;

    // console.log("Received titles:", title);

    if (title && title.length > 0) {
      content = await Content.find({
        title: { $in: title }
      });
    }

    if (content && content.length > 0) {
      const baseUrl = `${req.protocol}://${req.get("host")}/public/rulesImages/`;
      const formattedContent = content.map(item => ({
        ...item.toObject(),
        images: item.images.map(image => `${baseUrl}${image}`),
      }));

      res.status(200).json({
        success: true,
        data: formattedContent,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No content found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



const scrollingText = async (req, res) => {
  try {
    const { content, title } = req.body;

    // console.log("Received content:", content);

    if (!content || !title) {
      return res.status(400).json({
        success: false,
        message: "Content and title are required",
      });
    }

    // Find the content by title
    let existingContent = await Content.findOne({ title });

    if (existingContent) {
      // If content already exists, update it
      existingContent.content = content; // Assuming `content` is a field in your Content model
      await existingContent.save();

      res.status(200).json({
        success: true,
        message: "Content updated successfully",
        data: existingContent,
      });
    } else {
      // If content does not exist, create new
      const newContent = new Content({ title, content });
      await newContent.save();

      res.status(201).json({
        success: true,
        message: "Content created successfully",
        data: newContent,
      });
    }
  } catch (error) {
    console.error("Error in scrollingText:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getScrollText=async(req,res)=>{
  try{
    const content=await Content.findOne({title:"scrollingText"})
    if(!content){
      return res.status(404).json({
        success: false,
        message: "No scrolling text found",
      });
    }
    res.status(200).json({
      success: true,
      data: content.content,
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}





module.exports = {
  getRuleContent,
  createRuleContent,
  deleteRuleContent,
  editRuleContent,
  getRuleContentMultipleTitle,
  scrollingText,
  getScrollText
}
