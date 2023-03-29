const logger = require("../utils/logger");
const HttpStatus = require('http-status-codes');
const errorMessages = require('../utils/errorMessages');
const ErrorResponse = require("../utils/errorResponse");
const {checkIsMerchantAppAdmin} = require("../utils/queryUtils");
const apiUtils = require("../utils/apiUtils");
const secretKeyUtil = require('../utils/secretKeyUtil');

const merchant_app_admin = function (req, res, next) {
    const appId = req.headers["app-id"];
    const token = req.headers['x-api-key'];
    const secretKey = secretKeyUtil.readPublicPEMFile;
    let merchantId;
    apiUtils.verifyToken(token,secretKey)
    .then(decoded => {
        if(decoded){
            logger.debug('user decoded');
            let {userId} = decoded;
            merchantId = userId;
            req.ids = {merchantId,appId};
            return checkIsMerchantAppAdmin(appId,userId); 
        }else{
            throw new ErrorResponse(errorMessages.TOKEN_NOT_VERIFY,HttpStatus.UNAUTHORIZED);
        }
    })    
    .then(app => {
        if(app==null)throw new ErrorResponse(errorMessages.APP_NOT_EXIST,HttpStatus.NOT_FOUND);
        logger.debug(`merchant: ${merchantId} is admin of ${appId}`);
        next();
    })
    .catch(err => {
        if(!err.status)err.status = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorResponse = new ErrorResponse(err.message,err.status);
        return res.status(err.status).json(errorResponse.getErrorResponse());  
    })
};

module.exports = merchant_app_admin;
