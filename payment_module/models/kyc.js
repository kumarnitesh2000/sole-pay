const mongoose = require("mongoose");
const kycSchema = new mongoose.Schema({
  documentList: [
    {
      _id: false,
      isVerified: {type: Boolean, default: false},
      documentType: {type: String,enum: ["pan","aadhar","bank_account"]},
      reject_reason: {type: String, default: null},
      documentDetails:{type: Object}
    },
  ],
});

module.exports = mongoose.model("kyc", kycSchema);
