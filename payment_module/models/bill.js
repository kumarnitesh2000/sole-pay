const mongoose = require("mongoose");
const merchantModel = require("./merchant");
const appModel = require("./app");
const customerModel = require("./customer");
const globalConstant = require("../utils/globalConstant");
const logger = require("../utils/logger");
const axios = require("axios");
const { createHeadersForCallBack } = require("../utils/secretKeyUtil");
const billSchema = new mongoose.Schema({
  amountRanges: {
    _id: false,
    minAmount: { type: Number, default: 0 },
    maxAmount: { type: Number, default: 0 },
  },
  billCreatedAt: { type: Date, default: Date.now },
  billerId: { type: String, unique: true },
  additionalInfo: { type: Object },
  status: {
    type: String,
    enum: [
      "payment_bill.created",
      "payment_bill.partially_paid",
      "payment_bill.paid",
      "payment_bill.failed",
    ],
    default: "payment_bill.created",
  },
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: merchantModel },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: customerModel },
  payments: [
    {

      amountPaid: { type: Number },
      createdAt: { type: String },
    },
  ],
  paymentGatewayInfo: {
    _id: false,
    platformId: { type: String },
    paymentLink: { type: String },
    paymentGateway: { type: String, enum: ["razorpay", "setu", "mockpay"] },
  },
  app: { type: mongoose.Schema.Types.ObjectId, ref: appModel },
});

const billModel = mongoose.model("bill", billSchema);
const paymentChangeStreamPipeline = [
  {
    $match: {
      operationType: "update",
    },
  },
];
const changeStream = billModel.watch(paymentChangeStreamPipeline);
changeStream.on("change", async (change) => {
  try {
    const { documentKey } = change;
    const billModelId = documentKey[globalConstant.UNDERSCORE_ID];
    let _bill;
    billModel
      .findById(billModelId)
      .then((bill) => {
        _bill = bill;
        let appId = bill.app;
        return appModel.findById(appId);
      })
      .then(({ callbackUrl, callbackSecret }) => {
        if (callbackUrl && callbackSecret) {
          let headers = createHeadersForCallBack(callbackSecret, _bill);
          return axios({
            method: "post",
            url: callbackUrl,
            data: _bill,
            headers,
          });
        } else {
          throw new Error("callbackUrl or callBackSecret is missing");
        }
      })
      .catch((err) => {
        logger.error(
          `not able to send the information to callback due to ${err.response.data.message ? err.response.data.message: err}`
        );
      });
  } catch (error) {
    throw error;
  }
});
module.exports = billModel;
