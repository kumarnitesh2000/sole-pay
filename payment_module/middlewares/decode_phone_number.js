const logger = require("../utils/logger");
const {getMerchantByPhoneNumber} = require("../utils/queryUtils");
const globalConstant = require('../utils/globalConstant');
const errorMessages = require('../utils/errorMessages');

const decode_phonenum = function (req, res, next) {
    const {phoneNumber} = req.body;
    getMerchantByPhoneNumber(phoneNumber)
    .then(user => {
        req.userId = user[globalConstant.UNDERSCORE_ID];
        next();
    })
    .catch(err => {
        return Promise.reject(errorMessages.MERCHANT_NOT_EXIST);  
    })
};

module.exports = decode_phonenum;
