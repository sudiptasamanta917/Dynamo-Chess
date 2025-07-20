require("dotenv").config();

module.exports = {
    APP_PORT: process.env.APP_PORT || 8080,
    DB_URL: process.env.DB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    SESSIONSECRET: process.env.SESSIONSECRET,
    RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
    RAZORPAY_APT_SECRET: process.env.RAZORPAY_APT_SECRET,
    HOSTURL: process.env.HOSTURL,
    merchant_id: process.env.merchant_id,
    salt_key: process.env.salt_key,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};
