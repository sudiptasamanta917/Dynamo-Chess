const Product = require("../../models/productModel");
const mongoose = require("mongoose");

// Create Product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, sellPrice } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const multipleImages = req.files.map((file) => `productImages/${file.filename}`);

    const product = new Product({
      name,
      img: multipleImages[0],
      description,
      price,
      sellPrice,
      multipleImages,
    });

    const savedProduct = await product.save();
    await savedProduct.save();

    res.status(200).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message || error,
    });
  }
};

// Get all Products
const getAllProducts = async (req, res) => {
  try {
    // Extract pagination info from query parameters
    const { page = 1, limit = 10 } = req.query;

    // Ensure pagination values are valid integers
    const validatedPage = isNaN(page) ? 1 : parseInt(page);
    const validatedLimit = isNaN(limit) ? 10 : parseInt(limit);

    // Initialize match stage for aggregation (can be extended later for filtering)
    const matchStage = {};

    // Perform aggregation to fetch products
    const products = await Product.aggregate([
      { $match: matchStage }, // Match all products (or apply filters if any)
      {
        $project: {
          name: 1,
          img: 1,
          description: 1,
          price: 1,
          sellPrice: 1,
          multipleImages: 1,
        },
      },
      { $skip: (validatedPage - 1) * validatedLimit }, // Pagination skip
      { $limit: validatedLimit }, // Pagination limit
    ]);

    // Map product data to include full URLs for images
    const productWithImg = products.map((product) => ({
      ...product,
      img: product.img
        ? `${req.protocol}://${req.get("host")}/public/${product.img}`
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEaYTaC-q-QWUu2g7QgVvRKkJkqXjXtjBU2w&s", // Default image if no image exists
      multipleImages:
        product.multipleImages && product.multipleImages.length > 0
          ? product.multipleImages.map(
            (image) => `${req.protocol}://${req.get("host")}/public/${image}`
          )
          : [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEaYTaC-q-QWUu2g7QgVvRKkJkqXjXtjBU2w&s", // Default multiple image
          ],
    }));

    // Count the total number of products
    const totalItems = await Product.countDocuments(matchStage);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / validatedLimit);

    // Send the response with paginated products and additional info
    res.status(200).json({
      success: true,
      products: productWithImg,
      totalItems,
      totalPages,
      currentPage: validatedPage,
      totalLimit: validatedLimit,
    });
  } catch (error) {
    // Log error and respond with error message
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message || error,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    // Extract product ID from request parameters
    const { id } = req.params;

    // console.log("Received Product ID:", id);

    // Validate if `id` is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID format",
      });
    }

    // Perform aggregation to fetch the product by ID
    const products = await Product.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } }, // Use `new` to create an ObjectId instance
      {
        $project: {
          name: 1,
          img: 1,
          description: 1,
          price: 1,
          sellPrice: 1,
          multipleImages: 1,
        },
      },
    ]);

    // If no product is found
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Prepare product with full URLs for images
    const product = products[0]; // Since aggregation returns an array
    const baseUrl = `${req.protocol}://${req.get("host")}/public/`;

    const productWithImg = {
      ...product,
      img: product.img ? `${baseUrl}${product.img}` : getDefaultImage(),
      multipleImages:
        product.multipleImages && product.multipleImages.length > 0
          ? product.multipleImages.map((image) => `${baseUrl}${image}`)
          : [getDefaultImage()],
    };

    // Send the response with the product details
    res.status(200).json({
      success: true,
      product: productWithImg,
    });
  } catch (error) {
    // Log error and respond with error message
    console.error("Error fetching product by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message || error,
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, sellPrice } = req.body;

    // Initialize the updated product data
    const updatedData = {
      name,
      description,
      price,
      sellPrice,
    };

    // Handle new image uploads (if any)
    if (req.files && req.files.length > 0) {
      // Update the img field with the first image from the uploaded files
      updatedData.img = `productImages/${req.files[0].filename}`;
      updatedData.multipleImages = req.files.map(
        (file) => `productImages/${file.filename}`
      );
    }

    // Update product in the database
    const product = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    // If the product is not found, send a 404 error
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Return the updated product data
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message || error,
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message || error,
    });
  }
};

module.exports = { createProduct, getAllProducts, updateProduct, deleteProduct, getProductById };
