const User = require("../../models/userModel");
const Wallet = require("../../models/walletModel");
const WalletHistory = require("../../models/paymentHistoryModel");
const crypto = require("crypto");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const path = require("path");
const Razorpay = require("razorpay");
const {
  JWT_SECRET,
  salt_key,
  merchant_id,
  HOSTURL,
  RAZORPAY_API_KEY,
  RAZORPAY_APT_SECRET,
} = require("../../config");
const { createOrderRZP } = require("../product/orderController");

const razorpay = new Razorpay({
  key_id: RAZORPAY_API_KEY,
  key_secret: RAZORPAY_APT_SECRET,
});

function ConvertDynamoCoinsToInr(dynamoCoins) {
  const conversionRate = 20; // 1 rs = 20 DynamoCoins
  return dynamoCoins / conversionRate;
}
function  ConvertInrToDynamoCoins(rupees) {
  const conversionRate = 20; // 1 rs = 20 DynamoCoins
  return rupees * conversionRate;
}

const getWallet = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (token) {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const userId = decodedToken._id;

      let wallet = await Wallet.findOne({ userId });

      if (!wallet) {
        const add_wallet = new Wallet({
          userId: userId,
          balance: 0,
        });
        wallet = await add_wallet.save();
      }

      res.status(200).json({ success: true, data: wallet });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Please pass auth token" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getWalletHistory = async (req, res) => {
  try {
    const { types, page, limit } = req.query;

    // Validate and set default values for page and limit
    const validatedPage = page && !isNaN(page) ? parseInt(page) : 1;
    const validatedLimit = limit && !isNaN(limit) ? parseInt(limit) : 10;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];
    // console.log("Extracted Token:", token);

    if (!token) {
      return res.status(401).json({ success: false, message: "Token is missing" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
      // console.log("Decoded Token:", decodedToken);
    } catch (err) {
      console.error("Token Verification Error:", err);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userId = decodedToken._id;
    // console.log("User ID from Token:", userId);

    // Define the filter object for wallet history
    const filter = { userId };
    if (types) {
      filter.type = types;
    }

    // Use Mongoose's find method for filtering with pagination, sorting by date ascending
    const walletHistoryData = await WalletHistory.find(filter)
      .sort({ date: -1 }) // Sort by date in ascending order
      .skip((validatedPage - 1) * validatedLimit)
      .limit(validatedLimit)
      .exec();

    // Count total items for pagination
    const totalItems = await WalletHistory.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "All Wallet History",
      data: walletHistoryData,
      types: types,
      currentPage: validatedPage,
      totalPages: Math.ceil(totalItems / validatedLimit),
      totalItems: totalItems,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const getWalletAllHistory = async (req, res) => {
  try {
    let WalletHistorydata = await WalletHistory.find();
    // console.log("pppppdddd", WalletHistorydata);

    res.status(200).json({
      success: true,
      message: "All Wallet History",
      data: WalletHistorydata,
    });

    res.status(401).json({ success: false, message: "Please pass auth token" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const depositWallet = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const balance = req.body.balance;

    if (!token || !balance) {
      return res.status(400).json({
        success: false,
        message: "Please provide both token and balance",
      });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken._id;

    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
    }

    wallet.balance += +balance;

    await wallet.save();

    res
      .status(200)
      .json({ success: true, message: "Deposit successful", data: wallet });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const withdrawWallet = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const dynamoCoin = req.body.dynamoCoin;
    const type = req.body.type

    if (!token || !dynamoCoin) {
      return res.status(400).json({
        success: false,
        message: "Please provide both token and balance",
      });
    }

    if (dynamoCoin > 2000) {
      return res.status(400).json({
        success: false,
        message: "Minimum point 2000 is not available",
      });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken._id;

    let wallet = await Wallet.findOne({ userId });
    let user = await User.findById(userId);
    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
    }

    const inr = ConvertDynamoCoinsToInr(+dynamoCoin )


    if (wallet.balance >= inr || user.dynamoCoin >= +dynamoCoin) {
      wallet.balance -= inr;
      user.dynamoCoin -= +dynamoCoin;

      const wallet_data = await wallet.save();
      const user_data = await user.save();

      // console.log(wallet_data,user_data, "pppppppppdddddddddrrrrrrrrrrr");

      const walletId = wallet_data._id;

      const walletHistoryData = new WalletHistory({
        userId,
        walletId,
        userName: user.name,
        userEmail: user.email,
        type,
        balance:inr,
       dynamoCoin:dynamoCoin,
      });
      await walletHistoryData.save();
      res
        .status(200)
        .json({ success: true, message: "Withdraw successful", data: wallet });
    } else {
      res
        .status(400)
        .json({ success: false, message: "balance is not available" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const newPayment = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken._id;
    let user = await User.findById(userId);
    // console.log(user, "eeeeeeeeeeeeeee", userId);
    const merchantTransactionId = "T" + Date.now();
    const MUID = "MUID" + Date.now();
    const balance = req.body.balance;
    const data = {
      merchantId: merchant_id,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: MUID,
      name: user.name,
      amount: balance * 100,
      redirectUrl: `https://d11test.vercel.app/api/status/${merchantTransactionId}/${userId}/${balance}`,
      redirectMode: "POST",
      mobileNumber: user.mobile,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    // console.log(data, "rrrrrrrrrrrrrrrrrrrr");
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;
    // const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
    const prod_URL = HOSTURL;
    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        // return res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
        return res.status(200).json({
          success: true,
          message: "successful",
          url: response.data.data.instrumentResponse.redirectInfo.url,
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const checkStatus = async (req, res) => {
  const { txnId, userId, balance } = req.params;
  const merchantTransactionId = txnId;
  const merchantId = merchant_id;

  // console.log(
  //   merchantTransactionId,
  //   merchantId,
  //   balance,
  //   userId,
  //   "ppppppppppppppppppppppppppppppppppppddddddddddd"
  // );

  const keyIndex = 1;
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const options = {
    method: "GET",
    url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    //url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };

  // CHECK PAYMENT TATUS
  axios
    .request(options)
    .then(async (response) => {
      if (response.data.success === true) {
        if (!userId || !balance) {
          return res.status(400).json({
            success: false,
            message: "Please provide both userId and balance",
          });
        }

        let wallet = await Wallet.findOne({ userId });
        let user = await User.findById(userId);
        const coins = ConvertInrToDynamoCoins(+balance)
        user.dynamoCoin+=coins
        await user.save();

        // console.log(user, "kppppppppppppppkpp",coins);

        if (!wallet) {
          wallet = new Wallet({ userId, balance: 0 });
        }

        wallet.balance += +balance;

        const wallet_data = await wallet.save();

        // console.log(wallet_data, "pppppppppdddddddddrrrrrrrrrrr");

        const walletId = wallet_data._id;
        const type = "deposit";

        const walletHistoryData = new WalletHistory({
          userId,
          walletId,
          userName: user.name,
          userEmail: user.email,
          merchantTransactionId,
          type,
          balance,
         dynamoCoin: coins
        });
        await walletHistoryData.save();

        res.sendFile(
          path.join(__dirname, "..", "..", "public", "success.html")
        );
      } else {
        res.sendFile(path.join(__dirname, "..", "..", "public", "error.html"));
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const newPaymentInRazorpay = async (req, res) => {
  // console.log("========,,,,,,,,,,");
  const userId = req.user._id;
  let userData = await User.findById(userId);
  // console.log(userData);
  const { balance } = req.body;
  const image =
    "https://dynamo.gs3solution.us/assets/logo-C1YdKwJs.png";
  const options = {
    amount: Number(balance * 100),
    currency: "INR",
    receipt: "order_rcptid_11",
  };

  try {
    const order = await razorpay.orders.create(options);
    const orderdata = {
      userId,
      balance: balance,
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      key: RAZORPAY_API_KEY,
      image,
      order,
    };
    res.status(200).json({
      success: true,
      message: "successful",
      data: orderdata,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkStatusInRazorpay = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const { userId, balance } = req.params;
  // console.log(userId, balance, "rrrrrrrrrr");
  // Verify the payment signature
  const generated_signature = crypto
    .createHmac("sha256", razorpay.key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    // Payment is successful
    if (!userId || !balance) {
      return res.status(400).json({
        success: false,
        message: "Please provide both userId and balance",
      });
    }

    let wallet = await Wallet.findOne({ userId });
    let user = await User.findById(userId);

    // console.log(user, "kppppppppppppppkpp");

    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
    }

    wallet.balance += +balance;
    const addDynamoCoin = +balance * 20
    user.dynamoCoin += addDynamoCoin

    const wallet_data = await wallet.save();
    const user_data = await user.save();
    // console.log(wallet_data,user_data, "pppppppppdddddddddrrrrrrrrrrr");

    const walletId = wallet_data._id;
    const type = "deposit";

    const walletHistoryData = new WalletHistory({
      userId,
      walletId,
      userName: user.name,
      userEmail: user.email,
      razPaymentId: razorpay_payment_id,
      razOrderId: razorpay_order_id,
      razSignature: razorpay_signature,
      type,
      balance,
     dynamoCoin: addDynamoCoin
    });
    await walletHistoryData.save();

    res.sendFile(path.join(__dirname, "..", "..", "public", "success.html"));
  } else {
    // Payment verification failed
    res.sendFile(path.join(__dirname, "..", "..", "public", "error.html"));
  }
};

const checkStatusInRazorpayUseOrder = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  const { userId, productId, billingDetailsId } = req.params;

  // console.log("User ID for Razorpay Verification:", userId);

  // Verify the payment signature
  const generated_signature = crypto
    .createHmac("sha256", razorpay.key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    // Payment is successful
    if (!userId || !productId || !billingDetailsId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: userId, productId, or billingDetailsId",
      });
    }

    try {
      // Call the createOrderRZP function
      await createOrderRZP(userId, [{ productId }], billingDetailsId);

      // Redirect to success page
      res.sendFile(path.join(__dirname, "..", "..", "public", "success.html"));
    } catch (error) {
      console.error("Error during order creation:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating order",
        error: error.message,
      });
    }
  } else {
    // Payment verification failed
    res.sendFile(path.join(__dirname, "..", "..", "public", "error.html"));
  }
};



module.exports = {
  getWallet,
  depositWallet,
  withdrawWallet,
  newPayment,
  checkStatus,
  getWalletHistory,
  getWalletAllHistory,
  newPaymentInRazorpay,
  checkStatusInRazorpay,
  checkStatusInRazorpayUseOrder
};
