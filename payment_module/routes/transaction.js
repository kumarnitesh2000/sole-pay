const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const bill = require("../models/bill");
const ErrorResponse = require("../utils/errorResponse");
const validate_app = require("../middlewares/validate_app");
const merchant_in_app = require("../middlewares/merchant_in_app");
const { ObjectId } = require("mongoose").Types;

router.get(
  "/payment/transactions",
  [validate_app, merchant_in_app],
  (req, res) => {
    logger.debug(`get all the transactions for the merchant`);
    bill
      .aggregate([
        { $match: { merchant: ObjectId(req.merchantId) } },
        {
          $unwind: "$payments",
        },
        { $sort: { "payments.createdAt": -1 } },
        {$project: {payments: 1, billerId: 1, customer: 1}}
      ])
      .then((bills) => {
        return res.json(bills);
      })
      .catch((err) => {
        if (!err.status) err.status = 500;
        return res
          .status(err.status)
          .json(new ErrorResponse(err.message, err.status));
      });
  }
);

module.exports = router;
