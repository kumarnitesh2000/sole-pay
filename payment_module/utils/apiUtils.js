const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const logger = require("../utils/logger");
const globalConstant = require("../utils/globalConstant");
const QRCode = require("qrcode");
const otp_generator = require("otp-generator");
const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const errorMessages = require("../utils/errorMessages");
const { readPublicPEMFile } = require("./secretKeyUtil");

exports.getError = (message, statusCode) => {
  return {
    statusCode,
    message,
  };
};

exports.getResponse = (msg, statusCode) => {
  return {
    msg,
    statusCode,
  };
};
/**
 *
 * @param {*} payeeName
 * @param {*} amount
 * @param {*} reason
 * @param {*} vpa
 */
exports.createUpiLink = (payeeName, amount, reason, vpa) => {
  payeeName = encodeURI(payeeName);
  reason = encodeURI(reason);
  if (amount) {
    logger.debug(`pay rs. ${amount} to ${payeeName} for ${reason}`);
    return `${config.upi_pay_protocol}&pn=${payeeName}&pa=${vpa}&cu=${globalConstant.INDIAN_CURR}&am=${amount}&tn=${reason}`;
  } else {
    logger.debug(`pay to ${payeeName} for ${reason}`);
    return `${config.upi_pay_protocol}&pn=${payeeName}&pa=${vpa}&cu=${globalConstant.INDIAN_CURR}&tn=${reason}`;
  }
};
/**
 *
 * @param {*} base64
 * @param {*} data
 */
exports.createQrCode = (base64, data) => {
  return new Promise((resolve, reject) => {
    if (base64) {
      logger.debug("creating base64");
      QRCode.toDataURL(data, function (err, url) {
        if (err) {
          reject(err);
        } else {
          resolve({ base64: url });
        }
      });
    } else {
      logger.debug("creating qr without base64");
      QRCode.toString(data, function (err, url) {
        resolve({ msg: "only base64 service available" });
      });
    }
  });
};

/**
 * This function will generate the token for dev, test and prod environments
 * @param {*} data
 */
exports.generateToken = (data, expiryTime, privateCert, passPhrase) => {
  logger.debug("Inside generateToken");
  let jwtExpiryTime = expiryTime
    ? expiryTime
    : globalConstant.DEFAULT_JWT_EXPIRY_TIME;
  let token = jwt.sign(
    data,
    {
      key: privateCert,
      passphrase: passPhrase,
    },
    {
      algorithm: "RS256",
      expiresIn: jwtExpiryTime, // if no data found in application data, default expiration time is 72 hours
    }
  );
  logger.debug("jwt generated successfully");
  return token;
};

exports.generateOtp = () => {
  return otp_generator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

exports.verifyToken = (token, secretKey) => {
  logger.debug("verify token function");
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        let errorResponse = new ErrorResponse(
          errorMessages.TOKEN_NOT_VERIFY,
          400
        );
        reject(errorResponse.getErrorResponse());
      } else {
        resolve(decoded);
      }
    });
  });
};

exports.generateHash = (phoneNumber) => {
  logger.debug(`inside generate hash for otp system`);
  const otp = this.generateOtp(),expires = Date.now() + globalConstant.OTP_TTL;
  logger.debug(`otp generated: ${otp}`);
  const content = `${phoneNumber}.${otp},${expires}`;
  const hash = crypto
    .createHmac("sha256", readPublicPEMFile)
    .update(content)
    .digest("hex");
  return `${hash}.${expires}`;
};

exports.generateHashByOTP = (phoneNumber, otp, expires) => {
  const content = `${phoneNumber}.${otp},${expires}`;
  const hash = crypto
    .createHmac("sha256", readPublicPEMFile)
    .update(content)
    .digest("hex");
  return `${hash}`;
};

/**
 * This will generate the jwt token on the basis of input parameters
 * @param {*} userJson
 * @param {*} expiry_time
 * @param {*} privateCertKey
 * @param {*} private_pem_passphrase
 */
exports.generateXApiRefreshToken = (
  type,
  userJson,
  expiry_time,
  privateCertKey,
  private_pem_passphrase
) => {
  if (type == globalConstant.X_API_KEY) {
    userJson[globalConstant.SET_REFRESH_TOKEN_FIELD_NAME] = false;
  } else if (type == globalConstant.REFRESH_TOKEN) {
    userJson[globalConstant.SET_REFRESH_TOKEN_FIELD_NAME] = true;
  }
  logger.debug(`Generating ${type} jwt token`);
  let refresh_token = this.generateToken(
    userJson,
    expiry_time,
    privateCertKey,
    private_pem_passphrase
  );
  return refresh_token;
};
