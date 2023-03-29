require('dotenv').config();
module.exports = {
    development: {
        logDirectory: process.env.LOG_DIRECTORY || "/var/log/app",
        mongoURI: process.env.MONGO_URI,
        port:process.env.PORT || 4000,
        upi_pay_protocol:process.env.UPI_PAYMENT_LINK_BASE ,
        base_url: process.env.BASE_URL,
        passphrase: process.env.PASSPHRASE || "passphrase",
        admin_username: process.env.ADMIN_USERNAME,
        admin_password: process.env.ADMIN_PASSWORD ,
        admin_app_id: process.env.ADMIN_APP_ID,
        admin_app_secret: process.env.ADMIN_APP_SECRET,
        razorpay_url: process.env.RAZORPAY_URL,
        razorpay_token: process.env.RAZORPAY_TOKEN,
        mockpay_url: process.env.MOCKPAY_URL,
        mockpay_token: process.env.MOCKPAY_TOKEN
    },
    test: {
        logDirectory: process.env.LOG_DIRECTORY || "/var/log/app",   
        mongoURI: process.env.MONGO_URI,
        port:process.env.PORT || 4000,
        upi_pay_protocol:process.env.UPI_PAYMENT_LINK_BASE,
        base_url:process.env.BASE_URL,
        passphrase: process.env.PASSPHRASE || "passphrase",
        admin_username: process.env.ADMIN_USERNAME,
        admin_password: process.env.ADMIN_PASSWORD,
        admin_app_id: process.env.ADMIN_APP_ID,
        admin_app_secret: process.env.ADMIN_APP_SECRET,
        razorpay_url: process.env.RAZORPAY_URL,
        razorpay_token: process.env.RAZORPAY_TOKEN,
        mockpay_url: process.env.MOCKPAY_URL,
        mockpay_token: process.env.MOCKPAY_TOKEN
    },
    prod: {
        logDirectory: process.env.LOG_DIRECTORY || "/var/log/app",
        mongoURI: process.env.MONGO_URI,
        port:process.env.PORT || 4000,
        upi_pay_protocol:process.env.UPI_PAYMENT_LINK_BASE ,
        base_url: process.env.BASE_URL,
        passphrase: process.env.PASSPHRASE || "passphrase",
        admin_username: process.env.ADMIN_USERNAME,
        admin_password: process.env.ADMIN_PASSWORD,
        admin_app_id: process.env.ADMIN_APP_ID,
        admin_app_secret: process.env.ADMIN_APP_SECRET,
        razorpay_url: process.env.RAZORPAY_URL,
        razorpay_token: process.env.RAZORPAY_TOKEN,
        mockpay_url: process.env.MOCKPAY_URL,
        mockpay_token: process.env.MOCKPAY_TOKEN
    }
}