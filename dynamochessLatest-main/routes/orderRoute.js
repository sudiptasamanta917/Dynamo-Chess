const express = require("express");
const {
  createOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getAllOrdersForUser,
  getByOrderId,
} = require("../controllers/product/orderController");
const { user_auth, checkRole } = require("../utils/authUtils");

const orderRoute = express.Router();

// POST /api/orders - Create a new order
orderRoute.post("/orders", user_auth, checkRole(["user"]), createOrder);

// GET /api/orders - Get all orders (Admin only)
orderRoute.get("/orders", user_auth, checkRole(["admin"]), getAllOrders);

// GET /api/orders/:orderId - Get an order by orderId (Admin only)
orderRoute.get("/orders/:orderId", user_auth, checkRole(["admin"]), getByOrderId);

// GET /api/ordersForUser - Get all orders for the logged-in user
orderRoute.get("/ordersForUser", user_auth, checkRole(["user"]), getAllOrdersForUser);

// PUT /api/orders/:orderId - Update an order's status (Admin only)
orderRoute.post("/updatOrders/:orderId",user_auth, updateOrder);

// DELETE /api/orders/:orderId - Delete an order (Admin only)
orderRoute.delete("/orders/:orderId", user_auth, checkRole(["admin"]), deleteOrder);

module.exports = orderRoute;
