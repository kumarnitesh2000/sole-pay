const merchant = require("../models/merchant");
const globalConstant = require("../utils/globalConstant");
const app = require("../models/app");
const customer = require("../models/customer");
const logger = require("../utils/logger");
const secretKeyUtil = require("./secretKeyUtil");
const { verifyBankAccount } = require("./onBoardUtils");
const kycSchema = require("../models/kyc");
const bill = require("../models/bill");

/**
 * return mongo promise
 * @param {*} phoneNumber
 */
exports.getMerchantByPhoneNumber = (phoneNumber) => {
  return merchant.findOne({ phoneNumber });
};

/**
 * return mongo promise
 * @param {*} merchantId
 */
exports.getMerchantById = (merchantId) => {
  return merchant.findById(merchantId);
};

/**
 * this will add a merchant in app document under merchant list
 * @param {*} _merchant
 * @param {*} appId
 */
exports.addMerchantInApp = (_merchant, appId, isAdmin) => {
  return app.updateOne(
    { [globalConstant.UNDERSCORE_ID]: appId },
    {
      $push: {
        merchantList: {
          merchantId: _merchant[globalConstant.UNDERSCORE_ID],
          isAdmin,
        },
      },
    },
    { new: true, useFindAndModify: false }
  );
};

/**
 *
 * @param {*} _customer
 * @param {*} merchantId
 */
exports.addMerchantInCustomer = (_customer, merchantId) => {
  return customer.updateOne(
    { [globalConstant.UNDERSCORE_ID]: _customer[globalConstant.UNDERSCORE_ID] },
    {
      $push: {
        merchantList: {
          merchantId,
        },
      },
    },
    { new: true, useFindAndModify: false }
  );
};
/**
 *
 * @param {*} _customer
 * @param {*} merchantId
 * @returns
 */
exports.addCustomerInMerchant = (_customer, merchantId) => {
  return merchant.updateOne(
    { [globalConstant.UNDERSCORE_ID]: merchantId },
    {
      $push: {
        customerList: {
          customerId: _customer[globalConstant.UNDERSCORE_ID],
        },
      },
    },
    { new: true, useFindAndModify: false }
  );
};

/**
 * this will add a app in merchant document under app list
 * @param {*} app
 * @param {*} merchantId
 */
exports.addAppInMerchant = (app, merchantId) => {
  return merchant.updateOne(
    { [globalConstant.UNDERSCORE_ID]: merchantId },
    { $push: { appList: { appId: app[globalConstant.UNDERSCORE_ID] } } },
    { new: true, useFindAndModify: false }
  );
};

/**
 *
 * @param {*} appId
 */
exports.getAppById = (appId) => {
  return app.findById(appId);
};

/**
 * check that is merchant is admin of this app or not
 * @param {*} app
 * @param {*} merchantId
 */
exports.checkIsMerchantAppAdmin = (appId, merchantId) => {
  return app.findOne({
    [globalConstant.UNDERSCORE_ID]: appId,
    merchantList: { $elemMatch: { merchantId, isAdmin: true } },
  });
};

/**
 *
 * @param {*} incomingAppSecret
 * @param {*} app
 * @returns
 */
exports.verifyAppSecret = (incomingAppSecret, app) => {
  let finalHash = secretKeyUtil.hashedSecretToStore(
    incomingAppSecret,
    secretKeyUtil.readPublicPEMFile
  );
  return app["appSecret"] == finalHash;
};
/**
 *
 * @param {*} merchantId
 * @param {*} app
 */
exports.isMerchantInApp = (_merchantId, _app) => {
  return new Promise((resolve, reject) => {
    const { merchantList } = _app;
    merchantList.forEach(({ merchantId }) => {
      if (merchantId == _merchantId) resolve(true);
    });
    resolve(false);
  });
};

/**
 *
 * @param {*} phoneNumber
 * @param {*} merchantId
 * @returns
 */
exports.existAsCustomerOfMerchant = async (phoneNumber, merchantId) => {
  logger.debug(`inside existAsCustomerOfMerchant`);
  let _customer = await customer.findOne({
    phoneNumber,
    merchantList: { $elemMatch: { merchantId } },
  });
  return _customer != null;
};

exports.updateBankKyc = (kycId, document_info) => {
  const { ifsc, accountNumber } = document_info;
  let prefix = "documentList.2.";
  return kycSchema.updateOne(
    { [globalConstant.UNDERSCORE_ID]: kycId },
    {
      $set: {
        [`${prefix}isVerified`]: true,
        [`${prefix}documentDetails.accountNumber`]: accountNumber,
        [`${prefix}documentDetails.ifsc`]: ifsc,
      },
    }
  );
};

/**
 *
 * @param {*} kyc
 * @param {*} document_info
 */
exports.verifyAndUpdateBankAccount = (kyc, document_info) => {
  const kycId = kyc[globalConstant.UNDERSCORE_ID];
  return Promise.all([
    verifyBankAccount(document_info),
    this.updateBankKyc(kycId, document_info),
    kycSchema.findById(kycId),
  ]);
};

/**
 *
 * @param {*} app
 */
exports.getAdminOfApp = (app) => {
  let merchantId;
  app.merchantList.forEach((element) => {
    if (element.isAdmin == true) {
      merchantId = element.merchantId;
      logger.debug(`admin of ${app.appName}: ${merchantId}`);
      return;
    }
  });
  return this.getMerchantById(merchantId);
};
/**
 *
 * @param {*} param0
 */
exports.updateStatuswithPayment = ({
  billerId,
  amountPaid,
  createdAt,
  status,
}) => {
  return bill.updateOne(
    {
      billerId,
    },
    {
      $set: { status },
      $push: {
        payments: {
          amountPaid,
          createdAt,
        },
      },
    }
  );
};

/**
 *
 * @param {*} status
 */
exports.updateStatusOnly = (billerId, status) => {
  return bill.updateOne(
    {
      billerId,
    },
    { $set: { status } }
  );
};

exports.updateAppCallBack = ({ appId, callbackUrl, callbackSecret }) => {
  logger.debug("updating callback url information");
  return app.updateOne(
    { [globalConstant.UNDERSCORE_ID]: appId },
    { $set: { callbackUrl, callbackSecret } }
  );
};
