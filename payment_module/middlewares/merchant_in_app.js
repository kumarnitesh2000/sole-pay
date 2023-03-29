const logger = require("../utils/logger");
const apiUtils = require("../utils/apiUtils");
const secretKeyUtil = require("../utils/secretKeyUtil");
const ErrorResponse = require("../utils/errorResponse");
const HttpStatus = require("http-status-codes");
const { isMerchantInApp } = require("../utils/queryUtils");

const merchant_in_app = function (req, res, next) {
  logger.debug("validate if merchant belong to this app");
  const token = req.headers["x-api-key"];
  const secretKey = secretKeyUtil.readPublicPEMFile;
  let merchantId;
  apiUtils
    .verifyToken(token, secretKey)
    .then((decoded) => {
      let { userId } = decoded;
      merchantId = userId;
      return isMerchantInApp(userId, req.app);
    })
    .then((bool) => {
      if (bool)
        return Promise.resolve(
          `merchant: ${merchantId} belongs to app: ${req.app["appName"]}`
        );
      else throw new ErrorResponse("merchant not belongs to this app", 400);
    })
    .then((msg) => {
      logger.debug(msg);
      req.merchantId = merchantId;
      next();
    })
    .catch((err) => {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          apiUtils.getError(
            `merchant x-api-key is either empty or invalid: ${err.message}`,
            HttpStatus.UNAUTHORIZED
          )
        );
    });
};

module.exports = merchant_in_app;
