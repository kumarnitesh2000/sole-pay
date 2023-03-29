const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const env = process.env.NODE_ENV || "development";
const bill = require("../models/bill");
const HttpStatus = require("http-status-codes");
const ErrorResponse = require("../utils/errorResponse");
const { updateStatuswithPayment, updateStatusOnly} = require("../utils/queryUtils");
const { decodeMockPayStatus } = require("../utils/billUtils");

router.post("/webhook/mockpay/notifications", (req, res) => {
  logger.debug("incoming notifications from mockpay");
  const { platform_id,status, biller_id, payment_set} = req.body;
  bill
    .findOne({ billerId: biller_id ,"paymentGatewayInfo.platformId": platform_id})
    .then((bill) => {
      if (bill == null)
        throw new ErrorResponse(
          `no bill exist with billerId: ${biller_id} and platformId: ${platform_id}`,
          HttpStatus.BAD_REQUEST
        );
        let db_readable_status = decodeMockPayStatus(status);
        if(status=='paid' || status=='partially_paid'){
            let amountPaid = payment_set[0]["amount_paid"];
            let createdAt = payment_set[0]["created_at"];
            return updateStatuswithPayment({billerId:biller_id,amountPaid,createdAt,status: db_readable_status});
        }else{
            return updateStatusOnly(biller_id,db_readable_status);
        }
    })
    .then(_ => {
        res.json({"message":"bill status captured"});
    })
    .catch((err) => {
      if (!err.status) err.status = 500;
      return res
        .status(err.status)
        .json(new ErrorResponse(err.message, err.status));
    });
});

module.exports = router;
