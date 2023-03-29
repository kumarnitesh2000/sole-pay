const logger = require("../utils/logger");
const globalConstant = require('../utils/globalConstant');
const errorMessages = require('../utils/errorMessages');
const ErrorResponse = require("../utils/errorResponse");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const HttpStatus = require('http-status-codes');

const validate_admin = function (req, res, next) {
    logger.debug('validate the admin_username and admin_password');
    const adminSecret = req.headers["admin-secret"];
    const {admin_username,admin_password} = config;
    let encodedCred = Buffer.from(`${admin_username}:${admin_password}`).toString('base64');
    if(encodedCred==adminSecret){
        next();
    }else{
        return res.status(HttpStatus.BAD_REQUEST).json(new ErrorResponse(errorMessages.INVALID_CREDENTIAL, HttpStatus.BAD_REQUEST)); 
    }
};

module.exports = validate_admin;
