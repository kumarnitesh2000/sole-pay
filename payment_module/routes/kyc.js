const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const env = process.env.NODE_ENV || "development";
const globalConstant = require("../utils/globalConstant");
const validate_app = require("../middlewares/validate_app");
const merchant_in_app = require("../middlewares/merchant_in_app");
const kyc = require("../models/kyc");
const merchant = require("../models/merchant");
const ErrorResponse = require("../utils/errorResponse");
const HttpStatus = require("http-status-codes");
const {
  aadharDocStructure,
  panDocStructure,
  bankAccountDocStructure,
} = require("../utils/onBoardUtils");

const {verifyAndUpdateBankAccount} = require("../utils/queryUtils");

router.post(
  "/user/merchant/kyc",
  [validate_app, merchant_in_app],
  (req, res) => {
    let kycObject;
    logger.debug("initiate creating the kyc structure");
    merchant
      .findById(req.merchantId)
      .then((merchant) => {
        if (merchant.kycId)
          throw new ErrorResponse(
            "kyc for this merchant is already initialized",
            HttpStatus.BAD_REQUEST
          );
        return kyc.create({
          documentList: [
            aadharDocStructure,
            panDocStructure,
            bankAccountDocStructure,
          ],
        });
      })
      .then((kyc) => {
        kycObject = kyc;
        return merchant.updateOne(
          { [globalConstant.UNDERSCORE_ID]: req.merchantId },
          { $set: { kycId: kyc[globalConstant.UNDERSCORE_ID] } }
        );
      })
      .then((_) => {
        res.json(kycObject);
      })
      .catch((err) => {
        if (!err.status) err.status = 500;
        let errorResponse = new ErrorResponse(
          `kyc structure not init: ${err.message}`,
          err.status
        );
        return res.status(err.status).json(errorResponse.getErrorResponse());
      });
  }
);

router.put(
  "/user/merchant/kyc",
  [validate_app, merchant_in_app],
  (req, res) => {
    const { document_type, document_info } = req.body;
    logger.debug(`inside updating document ${document_type}`);
    merchant
      .findById(req.merchantId)
      .then((merchant) => {
        if (!merchant.kycId)
          throw new ErrorResponse(
            `merchant not initialized the kyc yet`,
            HttpStatus.BAD_REQUEST
          );
        logger.debug("merchant already initialized kyc");
        return kyc.findById(merchant.kycId);
      })
      .then((kyc) => {
        switch (document_type) {
          case "bank_account":
            return verifyAndUpdateBankAccount(kyc, document_info);
          default:
            throw new ErrorResponse(
              `${document_type} currently not supported`,
              HttpStatus.BAD_REQUEST
            );
        }
      })
      .then((resolve_array) => {
        logger.debug("status of document updated");
        return res.json(resolve_array[2]);
      })
      .catch((err) => {
        if (!err.status) err.status = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorResponse = new ErrorResponse(
          `kyc structure not updated: ${err.message}`,
          err.status
        );
        return res.status(err.status).json(errorResponse.getErrorResponse());
      });
  }
);

module.exports = router;
