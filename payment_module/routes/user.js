const express = require("express");
const logger = require("../utils/logger");
const router = express.Router();
const ErrorResponse = require("../utils/errorResponse");
const decode_phonenum = require("../middlewares/decode_phone_number");
const validate_app = require("../middlewares/validate_app");
const merchant_in_app = require("../middlewares/merchant_in_app");
const HttpStatus = require("http-status-codes");
const validate_merchant_app = require("../middlewares/validate_merchant_app");
const {
  generateHash,
  generateHashByOTP,
  generateXApiRefreshToken,
} = require("../utils/apiUtils");
const {
  addMerchantInApp,
  addMerchantInCustomer,
  addCustomerInMerchant,
  existAsCustomerOfMerchant,
  getMerchantById,
} = require("../utils/queryUtils");
const { readPrivatePEMFile } = require("../utils/secretKeyUtil");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const globalConstants = require("../utils/globalConstant");
const merchant = require("../models/merchant");
const customer = require("../models/customer");

router.post(
  "/user/register",
  [validate_app, validate_merchant_app],
  async (req, res) => {
    try {
      const { role, phoneNumber, displayName } = req.body;
      let userId;
      logger.debug("check for user in database");
      const app = req.app;
      let isUserExistPromise;
      switch (role) {
        case globalConstants.MERCHANT:
          isUserExistPromise = merchant.findOne({ phoneNumber });
          break;
        case globalConstants.CUSTOMER:
          isUserExistPromise = customer.findOne({ phoneNumber });
          break;
        default:
          throw new ErrorResponse(`role is incorrect or undefined`, 400);
      }
      isUserExistPromise
        .then(async (user) => {
          if (user == null) {
            switch (role) {
              case globalConstants.MERCHANT:
                return merchant.create({
                  merchantName: displayName,
                  phoneNumber,
                });
              case globalConstants.CUSTOMER:
                return customer.create({
                  customerName: displayName,
                  phoneNumber
                });
              default:
                throw new ErrorResponse(`role is incorrect or undefined`, 400);
            }
          } else {
            let bool = await existAsCustomerOfMerchant(
              phoneNumber,
              req.merchantId
            );
            if (role == "customer" && !bool) {
              logger.debug(
                `customer exist but not customer of merchant ${req.merchantId}`
              );
              return Promise.resolve(user);
            } else {
              throw new ErrorResponse(`user already exist as ${role}`, 400);
            }
          }
        })
        .then((user) => {
          userId = user[globalConstants.UNDERSCORE_ID];
          if (role == "merchant")
            return addMerchantInApp(
              user,
              app[globalConstants.UNDERSCORE_ID],
              false
            );
          if (role == "customer")
            return Promise.all([
              addCustomerInMerchant(user, req.merchantId),
              addMerchantInCustomer(user,req.merchantId),
            ]);
        })
        .then(() => {
          logger.debug(`register a user: ${role}`);
          if(role=="customer"){
            return res.json({ phoneNumber, userId });
          }else{
            const hash = generateHash(phoneNumber);
            return res.json({ hash, phoneNumber, userId });
          }
        })
        .catch((err) => {
          if (!err.status) err.status = 500;
          return res
            .status(err.status)
            .json(new ErrorResponse(err.message, err.status));
        });
    } catch (e) {
      let errorResponse = new ErrorResponse(e.message, HttpStatus.BAD_REQUEST);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(errorResponse.getErrorResponse());
    }
  }
);

router.post("/user/login", (req, res) => {
  logger.debug("inside user login");
  const { phoneNumber, role } = req.body;
  let isUserExistPromise;
  switch (role) {
    case globalConstants.MERCHANT:
      isUserExistPromise = merchant.findOne({ phoneNumber });
      break;
    case globalConstants.CUSTOMER:
      isUserExistPromise = customer.findOne({ phoneNumber });
    default:
      let errorResponse = new ErrorResponse(
        `role is incorrect or undefined`,
        HttpStatus.BAD_REQUEST
      );
      return res.status(HttpStatus.BAD_REQUEST).json(errorResponse.getErrorResponse());
  }
  isUserExistPromise
    .then((user) => {
      if (user != null) {
        logger.debug(`login a user: ${role}`);
        const hash = generateHash(phoneNumber);
        return res.json({ hash, phoneNumber });
      } else {
        throw new ErrorResponse(`user not exist as ${role}`, 400);
      }
    })
    .catch((err) => {
      if(!err.status)err.status = 500;
      return res.status(err.status).json(new ErrorResponse(err.message, err.status));
    });
});

router.post("/user/verifyOTP", [decode_phonenum], (req, res) => {
  logger.debug("verifying otp");
  try {
    const { hash, phoneNumber, otp } = req.body;
    const [hashValue, expires] = hash.split(".");
    logger.debug("check for otp expiration");
    if (Date.now() > expires)
      throw new ErrorResponse("provided otp is expired", 400);
    logger.debug("validate opt");
    if (generateHashByOTP(phoneNumber, otp, expires) == hashValue) {
      const userFullJson = { userId: req.userId };
      let x_api_token = generateXApiRefreshToken(
        globalConstants.X_API_KEY,
        userFullJson,
        globalConstants.JWT_TOKEN_EXPIRY_TIME,
        readPrivatePEMFile,
        config.passphrase
      );
      let refresh_token = generateXApiRefreshToken(
        globalConstants.REFRESH_TOKEN,
        userFullJson,
        globalConstants.REFRESH_TOKEN_EXPIRY_TIME,
        readPrivatePEMFile,
        config.passphrase
      );
      res.json({
        "x-api-key": x_api_token,
        "refresh-token": refresh_token,
      });
    } else {
      throw new ErrorResponse("provided otp is invalid", 400);
    }
  } catch (e) {
    console.log(e);
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(new ErrorResponse(e.message, HttpStatus.BAD_REQUEST));
  }
});

router.get("/user/customers", [validate_app, merchant_in_app], (req, res) => {
  const { merchantId } = req;
  getMerchantById(merchantId)
    .then((merchant) => {
      if (merchant["customerList"].length) res.json(merchant["customerList"]);
      else
        throw new ErrorResponse(
          "no customer created yet or merchant not exist",
          200
        );
    })
    .catch((err) => {
      if (!err.status) err.status = HttpStatus.BAD_REQUEST;
      return res
        .status(err.status)
        .json(new ErrorResponse(err.message, err.status));
    });
});

router.get("/user/merchant", [validate_app, merchant_in_app], (req, res) => {
  const { merchantId } = req;
  res.json({
    merchantId,
  });
});

module.exports = router;
