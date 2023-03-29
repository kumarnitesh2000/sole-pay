const mongoose = require("mongoose");
const kycSchema = require("./kyc");
const merchantSchema = new mongoose.Schema({
  merchantName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isPhoneNumberVerified: {
    type: Boolean,
    default: false,
  },
  appList: [
    {
      _id: false,
      appId: { type: mongoose.Schema.Types.ObjectId, ref: "app" },
    },
  ],
  customerList: [
    {
      _id: false,
      customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer" },
    },
  ],
  kycId:{type: mongoose.Schema.Types.ObjectId, ref: kycSchema}
});

module.exports = mongoose.model("merchant", merchantSchema);
