const express = require("express");
const path = require("path");
const multer = require("multer");
const { createProduct, getAllProducts, updateProduct, deleteProduct, getProductById } = require("../controllers/product/productController");

const productRouter = express.Router();

// Use Express middleware for parsing JSON and URL-encoded data
productRouter.use(express.urlencoded({ extended: true }));
productRouter.use(express.json());

// Serve static files from the "public" directory
productRouter.use(express.static(path.join(__dirname, "../public")));

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../public/productImages");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// POST /api/product - Create a new product
productRouter.post("/createProduct", upload.array("productImages", 5), createProduct);
productRouter.get("/product/:id", getProductById);
// GET /api/products - Get all products
productRouter.get("/getAllProducts", getAllProducts);

// POST /api/updateProduct/:id - Update a product by ID
productRouter.post("/updateProduct/:id", upload.array("productImages", 5), updateProduct);

// DELETE /api/product/:id - Delete a product by ID
productRouter.get("/deleteProduct/:id", deleteProduct);

module.exports = productRouter;
