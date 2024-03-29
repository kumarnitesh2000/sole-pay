const fs = require("fs");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const crypto = require("crypto");
const globalConstant = require("../utils/globalConstant");
const logger = require("./logger");
const public_pem_file_path = process.env.PUBLIC_PEM_FILE_PATH ? process.env.PUBLIC_PEM_FILE_PATH: "public.pem";
const private_pem_file_path = process.env.PRIVATE_PEM_FILE_PATH ? process.env.PRIVATE_PEM_FILE_PATH: "private.pem";

/**
 * private pem file path
 */
let private_key;

try {
  private_key = fs.readFileSync(
    path.join(
      path.dirname(__dirname),
      `${private_pem_file_path}`
    )
  );
} catch (err) {
  logger.error('Error reading private key file:', err);
}
/**
 * public pem file path
 */
let public_key;

try {
  public_key = fs.readFileSync(
    path.join(
      path.dirname(__dirname),
      `${public_pem_file_path}`
    )
  );
} catch (err) {
  logger.error('Error reading public key file:', err);
}


/**
 *
 * @param {*} secret
 * @param {*} salt
 * @returns
 */
exports.hashedSecretToStore = (secret, salt) => {
  return crypto
    .pbkdf2Sync(
      secret,
      salt,
      globalConstant.ITERATION,
      globalConstant.NUMBER_OF_BITS,
      globalConstant.HASH_ALGO
    )
    .toString("hex");
};

exports.createSecretKey = () => {
  return crypto.randomBytes(globalConstant.NUMBER_OF_BITS).toString("hex");
};

/**
 * return headers
 * @param {*} callbackSecret
 * @param {*} bill
 */
exports.createHeadersForCallBack = (callbackSecret, bill) => {
  return {
    "Content-Type": "application/json",
    "x-pay-signature-256": this.secureKey(callbackSecret, bill),
  };
};


exports.secureKey = (secretKey,payload) => {
    logger.debug('secure key function');
    try {
      if(secretKey && payload){
        return `sha256=${crypto.createHmac('sha256',secretKey).update(JSON.stringify(payload)).digest('hex')}`;
      } else {
        return null;
      }
    }
    catch(err) {
      logger.error(err);
    }
  }

exports.readPrivatePEMFile = private_key;
exports.readPublicPEMFile = public_key;
