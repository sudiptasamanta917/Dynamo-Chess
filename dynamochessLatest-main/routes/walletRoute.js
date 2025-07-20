const bodyParser = require("body-parser");
const express = require("express");
const wallet_route = express();
const crypto = require("crypto");
const {
  getWallet,
  withdrawWallet,
  newPayment,
  checkStatus,
  getWalletHistory,
  getWalletAllHistory,
  newPaymentInRazorpay,
  checkStatusInRazorpay,
  checkStatusInRazorpayUseOrder,
} = require("../controllers/wallet/walletController");

const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");
wallet_route.use(bodyParser.urlencoded({ extended: true }));
wallet_route.use(bodyParser.json());

wallet_route.get("/get-wallet", user_auth, async (req, res) =>
  getWallet(req, res)
);
wallet_route.get("/get-wallet-history", user_auth, async (req, res) =>
  getWalletHistory(req, res)
);
wallet_route.get(
  "/get-wallet-all-history",
  user_auth,
  checkRole(["admin"]),
  async (req, res) => getWalletAllHistory(req, res)
);
wallet_route.post("/withdraw-wallet", user_auth, async (req, res) =>
  withdrawWallet(req, res)
);

wallet_route.post("/payment-phonepe", user_auth, async (req, res) =>
  newPayment(req, res)
);
wallet_route.post("/status/:txnId/:userId/:balance", async (req, res) =>
  checkStatus(req, res)
);

wallet_route.post("/payment-razorpay", user_auth, async (req, res) =>
  newPaymentInRazorpay(req, res)
);

wallet_route.post("/status-razorpay/:userId/:balance", async (req, res) =>
  checkStatusInRazorpay(req, res)
);

wallet_route.post("/status-razorpay-order/:userId/:productId/:billingDetailsId", async (req, res) =>
  checkStatusInRazorpayUseOrder(req, res)
);


module.exports = wallet_route;
