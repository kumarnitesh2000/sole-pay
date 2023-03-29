const HttpStatus = require('http-status-codes');
const logger = require('../utils/logger');
const apiUtils = require('../utils/apiUtils');
const errorMessages = require('../utils/errorMessages');
const secretKeyUtil = require('../utils/secretKeyUtil');

const authenticate_user = function (req, res, next) {
        logger.debug('authorization checkup');
        const token = req.headers['x-api-key'];
        if(token){
            const secretKey = secretKeyUtil.readPublicPEMFile;
            apiUtils.verifyToken(token,secretKey)
            .then(decoded => {
                if(decoded){
                    logger.debug('user decoded');
                    req.jwt = decoded;
                    next();
                }else{
                    logger.error(errorMessages.TOKEN_NOT_VERIFY);
                    return Promise.reject(errorMessages.TOKEN_NOT_VERIFY);
                }
            })
            .catch(error =>{
                logger.error(`unauthorized :: ${error}`);
                res.status(HttpStatus.UNAUTHORIZED).json(
                apiUtils.getError(
                `unauthorized :: ${error}` || 'unauthorized',
                HttpStatus.UNAUTHORIZED))
            })
        }else{
            logger.error(`unauthorized :: token not send`);
            res.status(HttpStatus.UNAUTHORIZED).json(
            apiUtils.getError(
            'unauthorized :: token not send',
            HttpStatus.UNAUTHORIZED))
        }
    }


module.exports = authenticate_user;