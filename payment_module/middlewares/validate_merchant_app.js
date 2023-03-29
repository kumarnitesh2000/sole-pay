const logger = require("../utils/logger");
const apiUtils = require("../utils/apiUtils");
const secretKeyUtil = require("../utils/secretKeyUtil");
const ErrorResponse = require("../utils/errorResponse");
const HttpStatus = require("http-status-codes");
const { isMerchantInApp } = require("../utils/queryUtils");


const validate_merchant_app = function (req, res, next) {
  const { role } = req.body;
  if (role == "customer") {
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
      .then(bool => {
        if(bool)return Promise.resolve(`merchant: ${merchantId} belongs to app: ${req.app["appName"]}`);
        else throw new ErrorResponse("merchant not belongs to this app",400);
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
              `merchant not present in app reason: ${err.message}`,
              HttpStatus.UNAUTHORIZED
            )
          );
      });
  } else {
    next();
  }
};

module.exports = validate_merchant_app;
