const globalConstant = require("../utils/globalConstant");
const ErrorResponse = require("../utils/errorResponse");
const HttpStatus = require("http-status-codes");
exports.aadharDocStructure = {
  isVerified: false,
  documentType: "aadhar",
  reject_reason: null,
  documentDetails: {
    aadhaarNumber: "",
  },
};

exports.panDocStructure = {
  isVerified: false,
  documentType: "pan",
  reject_reason: null,
  documentDetails: {
    pan: "",
    consent: "",
    reason: "",
  },
};

exports.bankAccountDocStructure = {
  isVerified: false,
  documentType: "bank_account",
  reject_reason: null,
  documentDetails: {
    ifsc: "",
    accountNumber: "",
  },
};

exports.verifyBankAccount = (document_info) => {
  const { ifsc, accountNumber } = document_info;
  return new Promise((resolve, reject) => {
    let descision =
      ifsc == globalConstant.VERIFIED_BANK_IFSC &&
      accountNumber == globalConstant.VERIFIED_BANK_ACCOUNT;
    if (descision) resolve(descision);
    else
      throw new ErrorResponse(
        `bank accont verification failed`,
        HttpStatus.BAD_REQUEST
      );
  });
};

/**
 * just check is bank Account Verified or not
 * @param {*} kyc
 */
exports.isWholeKycProcessDone = (kyc) => {
  return kyc.documentList[2]["documentDetails"]["isVerified"]==true;
};
