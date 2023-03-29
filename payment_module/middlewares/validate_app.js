const logger = require("../utils/logger");
const {getAppById} = require("../utils/queryUtils");
const HttpStatus = require('http-status-codes');
const errorMessages = require('../utils/errorMessages');
const ErrorResponse = require("../utils/errorResponse");
const {verifyAppSecret} = require("../utils/queryUtils");

const validate_app = function (req, res, next) {
    logger.debug("validating the app credentials");
    const appId = req.headers["app-id"];
    const appSecret = req.headers["app-secret"];
    getAppById(appId)
    .then(app => {
        if(app==null)throw new ErrorResponse(errorMessages.APP_NOT_EXIST,HttpStatus.NOT_FOUND);
        if(!verifyAppSecret(appSecret,app))throw new ErrorResponse(errorMessages.INVALID_APP_SECRET,HttpStatus.BAD_REQUEST);
        req.app = app;
        next();
    })
    .catch(err => {
        if(!err.status)err.status = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorResponse = new ErrorResponse(err.message,err.status);
        return res.status(err.status).json(errorResponse.getErrorResponse());  
    })
};

module.exports = validate_app;
