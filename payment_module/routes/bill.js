const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const bill = require("../models/bill");
const kyc = require("../models/kyc");
const {
  generatePayMentLink,
  extractPaymentGateWayInfo,
} = require("../utils/billUtils");
const HttpStatus = require("http-status-codes");
const ErrorResponse = require("../utils/errorResponse");
const validate_app = require("../middlewares/validate_app");
const merchant_in_app = require("../middlewares/merchant_in_app");
const { getAdminOfApp } = require("../utils/queryUtils");
const customer = require("../models/customer");
const globalConstant = require("../utils/globalConstant");
const { isWholeKycProcessDone } = require("../utils/onBoardUtils");
const merchant = require("../models/merchant");

router.post("/payment/bill", [validate_app, merchant_in_app], (req, res) => {
  logger.debug(`inside bill creation api`);
  const { billerId, paymentGateway, amountRanges, additionalInfo, customerId } =
    req.body;
  const { minAmount, maxAmount } = amountRanges;
  let merchantName;
  customer
    .findOne({
      [globalConstant.UNDERSCORE_ID]: customerId,
      merchantList: { $elemMatch: { merchantId: req.merchantId } },
    })
    .then((customer) => {
      if (customer == null)
        throw new ErrorResponse(
          `customer not exist with customerId: ${customerId} or not a customer of this merchant`,
          HttpStatus.BAD_REQUEST
        );
      return bill.findOne({ billerId });
    })
    .then((bill) => {
      if (bill != null)
        throw new ErrorResponse(
          `bill is already created with billerId: ${billerId}`,
          HttpStatus.BAD_REQUEST
        );
      return getAdminOfApp(req.app);
    })
    .then((merchant_admin) => {
      if (!merchant_admin.kycId)
        throw new ErrorResponse(
          `admin of this app ${merchant_admin.merchantName} did't initialized kyc`,
          HttpStatus.UNAUTHORIZED
        );
      merchantName = merchant_admin.merchantName;
      return kyc.findById(merchant_admin.kycId);
    })
    .then((_kyc) => {
      logger.debug("kyc docs extracted");
      if (isWholeKycProcessDone(_kyc))
        throw new ErrorResponse(
          `admin of this app ${merchantName} did't complete the kyc`,
          HttpStatus.BAD_REQUEST
        );
      return merchant.findById(req.merchantId);
    })
    .then((merchant) => {
      return generatePayMentLink(
        billerId,
        paymentGateway,
        minAmount,
        maxAmount,
        merchant.merchantName
      );
    })
    .then((response) => {
      logger.debug(`getting response from ${paymentGateway}`);
      const paymentGatewayInfo = extractPaymentGateWayInfo(
        response,
        paymentGateway
      );
      return bill.create({
        amountRanges,
        billerId,
        additionalInfo,
        paymentGatewayInfo,
        merchant: req.merchantId,
        customer: customerId,
        app: req.app[globalConstant.UNDERSCORE_ID]
      });
    })
    .then((bill) => {
      return res.json(bill);
    })
    .catch((err) => {
      console.log(err);
      if(err.isAxiosError){
        err.message = err.response.data.message;
        if(!err.message)err.message = 'payment gateway setup is not correct'
        err.status = err.response.status;
      }
      if (!err.status) err.status = 500;
      return res
        .status(err.status)
        .json(new ErrorResponse(err.message, err.status));
    });
});

router.get("/payment/bill", [validate_app, merchant_in_app], (req, res) => {
  bill
    .find({ merchant: req.merchantId }).sort({billCreatedAt: -1})
    .then((bills) => {
      res.json(bills);
    })
    .catch((err) => {
      if (!err.status) err.status = 500;
      return res
        .status(err.status)
        .json(new ErrorResponse(err.message, err.status));
    });
});

router.get(
  "/payment/bill/:billerId",
  [validate_app, merchant_in_app],
  (req, res) => {
    const { billerId } = req.params;
    logger.debug(`fetching bill details for billerId: ${billerId}`);
    bill
      .findOne({ billerId, merchant: req.merchantId })
      .then((bill) => {
        if (bill == null)
          throw new ErrorResponse(
            `bill not exist with billerId: ${billerId}`,
            HttpStatus.NOT_FOUND
          );
        return res.json(bill);
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
