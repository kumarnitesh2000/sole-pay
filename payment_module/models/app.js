const mongoose = require("mongoose");

const appSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true,
  },
  appSecret: {
    type: String,
    required: true,
  },
  callbackUrl: {
    type: String
  },
  callbackSecret: {
    type: String
  },
  isMainApp: {
    type: Boolean,
    default: false
  },
  merchantList: [
    {
      _id: false,
      isAdmin: { type: Boolean, default: false },
      merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "merchant" },
    },
  ],
});

module.exports = mongoose.model("app", appSchema);
