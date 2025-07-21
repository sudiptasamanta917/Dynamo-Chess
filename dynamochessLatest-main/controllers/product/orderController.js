const Order = require("../../models/orderModel");
const Product = require("../../models/productModel");
// const User = require("../../models/userModel");
// const path = require("path");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
// const { createInvoice } = require("../../utils/createInvoice");
const BillingDetails = require("../../models/billingDetailsModel");
// Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, billingDetailsId } = req.body; // Extract request body
    const user = req.user; // Assumes middleware adds authenticated user to `req`

    if (!user || !user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order items are required" });
    }

    if (!billingDetailsId) {
      return res.status(400).json({ success: false, message: "Billing details ID is required" });
    }

    // Fetch billing details
    const billingDetails = await BillingDetails.findById(billingDetailsId);
    if (!billingDetails) {
      return res.status(404).json({
        success: false,
        message: `Billing details not found for ID ${billingDetailsId}`,
      });
    }

    // Fetch product details
    // Validate product IDs
    const productIds = items.map((item) =>
      new mongoose.Types.ObjectId(item.productId)
    );


    // Fetch product details
    const products = await Product.aggregate([
      { $match: { _id: { $in: productIds } } },
      {
        $project: {
          name: 1,
          stock: 1,
          price: 1,
          sellPrice: 1,
          img: 1,
          effectivePrice: {
            $cond: {
              if: { $gt: ["$sellPrice", 0] },
              then: "$sellPrice",
              else: "$price",
            },
          },
        },
      },
    ]);


    const updatedItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found for ID ${item.productId}`,
        });
      }

      const itemTotal = product.effectivePrice;
      totalPrice += itemTotal;

      updatedItems.push({
        productId: product._id,
        productName: product.name,
        price: product.effectivePrice,
        img: product.img
          ? `${req.protocol}://${req.get("host")}/public/${product.img}`
          : "https://via.placeholder.com/150",
      });
    }

    // Generate order ID
    const orderId = `ORD-${uuidv4().slice(0, 10)}`;

    // Save new order
    const order = new Order({
      orderId,
      user: user._id,
      billingDetails: billingDetails.toObject(),
      items: updatedItems,
      totalPrice,
    });

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error during order creation:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();
    const orders = await Order.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: startIndex },
      { $limit: limit },
    ]);

    res.status(200).json({
      success: true,
      orders,
      meta: {
        totalItems: totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

const getByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const orders = await Order.aggregate([
      { $match: { orderId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          _id: 1,
          orderId: 1,
          billingDetails: 1,
          items: 1,
          totalPrice: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          userDetails: 1,
          productDetails: 1,
          timeline: 1,
        },
      },
    ]);

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({ success: true, order: orders[0] });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order by ID",
      error: error.message,
    });
  }
};

const getAllOrdersForUser = async (req, res) => {
  try {
    const user = req.user;

    // Check if the user is authenticated
    if (!user || !user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User authentication is required.",
      });
    }

    const { page = 1, limit = 10, delivered } = req.query;
    const skip = (page - 1) * limit;

    // Construct query to filter orders by user and delivery status
    const query = { user: user._id };
    if (delivered) {
      query.status = delivered === "true" ? "Delivered" : { $ne: "Delivered" };
    }

    // Count total documents for pagination
    const totalItems = await Order.countDocuments(query);

    // Fetch orders with aggregations
    const orders = await Order.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "billingdetails",
          localField: "billingDetails._id",
          foreignField: "_id",
          as: "billingDetails",
        },
      },
      { $unwind: { path: "$billingDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $project: {
          orderId: 1,
          totalPrice: 1,
          status: 1,
          createdAt: 1,
          expectedDeliveryDate: 1,
          "billingDetails.name": 1,
          "billingDetails.email": 1,
          "billingDetails.phone": 1,
          "billingDetails.address": 1,
          "billingDetails.city": 1,
          "billingDetails.state": 1,
          "billingDetails.postcode": 1,
          items: 1,
          productDetails: {
            _id: 1,
            name: 1,
            price: 1,
            img: 1,
          },
        },
      },
    ]);

    // Send the response
    res.status(200).json({
      success: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required to update the order",
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.timeline.push({ status, date: new Date(), completed: true });
    order.status = status;
    order.updatedAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message,
    });
  }
};

const createOrderRZP = async (userId, items, billingDetailsId) => {
  try {
    if (!userId || !items || items.length === 0 || !billingDetailsId) {
      throw new Error("Missing required parameters: userId, items, or billingDetailsId");
    }

    // Fetch billing details
    const billingDetails = await BillingDetails.findById(billingDetailsId);
    if (!billingDetails) {
      throw new Error(`Billing details not found for ID ${billingDetailsId}`);
    }

    // Fetch product details
    const productIds = items.map((item) => new mongoose.Types.ObjectId(item.productId)); // Fix here
    const products = await Product.aggregate([
      { $match: { _id: { $in: productIds } } },
      {
        $project: {
          name: 1,
          stock: 1,
          price: 1,
          sellPrice: 1,
          img: 1,
          effectivePrice: {
            $cond: {
              if: { $gt: ["$sellPrice", 0] },
              then: "$sellPrice",
              else: "$price",
            },
          },
        },
      },
    ]);

    if (products.length === 0) {
      throw new Error("No valid products found for the provided product IDs");
    }

    const updatedItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) {
        throw new Error(`Product not found for ID ${item.productId}`);
      }

      const itemTotal = product.effectivePrice;
      totalPrice += itemTotal;

      updatedItems.push({
        productId: product._id,
        productName: product.name,
        price: itemTotal,
        img: product.img
          ? `https://dev.${VITE_URL}/public/${product.img}`
          : "https://via.placeholder.com/150",
      });
    }

    // Generate order ID
    const orderId = `ORD-${uuidv4().slice(0, 10)}`;

    // Save new order
    const order = new Order({
      orderId,
      user: userId,
      billingDetails: billingDetails.toObject(),
      items: updatedItems,
      totalPrice,
    });

    await order.save();
    console.log("Order created successfully:", order);
    return order;
  } catch (error) {
    console.error("Error during order creation:", error);
    throw error;
  }
};

module.exports = {
  getAllOrders,
  getByOrderId,
  getAllOrdersForUser,
  updateOrder,
  deleteOrder,
  createOrder,
  createOrderRZP
};
