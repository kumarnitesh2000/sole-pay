const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  customerName: {
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
  merchantList: [
    {
      _id: false,
      merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "merchant" },
    },
  ],
});

module.exports = mongoose.model("customer", customerSchema);
