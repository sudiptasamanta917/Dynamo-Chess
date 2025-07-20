const express = require("express");
const {
  createBillingDetails,
  getAllBillingDetails,
  getBillingDetailsById,
  updateBillingDetails,
  deleteBillingDetails,
  getBillingDetailsByUserId,
} = require("../controllers/product/billingDetailsController");
const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");
const BillingDetailRouter = express.Router();

// Define the routes
BillingDetailRouter.post(
    "/billing-details",
    user_auth,
    checkRole(["user"]),
    createBillingDetails
  );
  
  BillingDetailRouter.get("/billing-details", getAllBillingDetails);
  BillingDetailRouter.get("/billing-details/:id", getBillingDetailsById);
  BillingDetailRouter.get(
  "/billing-details-usre-id",
  user_auth,
  checkRole(["user"]),
  getBillingDetailsByUserId
);
BillingDetailRouter.post("/billing-details-update/:id", updateBillingDetails);
BillingDetailRouter.get("/billing-details-delete/:id", deleteBillingDetails);

module.exports = BillingDetailRouter;
