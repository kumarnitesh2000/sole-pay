const express = require('express');
const logger = require('../utils/logger');
const router = express.Router();
const upiPayLinks = require('../models/upi_qr_links')
const apiUtils = require('../utils/apiUtils')
const HttpStatus = require('http-status-codes');

router.post('/generate/upiLink', (req,res)=>{
    logger.debug('generating the payment link');
    let {amount,payeeName,reason,vpa} = req.body;
    logger.debug(amount);
    let link = apiUtils.createUpiLink(payeeName, amount,reason,vpa);
    res.json({link});
})

router.post('/generate/qrCode',(req,res)=>{
    logger.debug('generating the qr code');
    const {data,base64} = req.body;
    apiUtils.createQrCode(base64,data)
    .then(response => {
        res.json(response);
    })
})

router.post('/generate/upiCard',(req,res)=>{
    logger.debug('generating a upi card');
    let {amount,payeeName,reason,vpa,bgColor,logo} = req.body;
    let link = apiUtils.createUpiLink(payeeName, amount,reason,vpa);
    let base64 = true;
    let qrcode;
    apiUtils.createQrCode(base64,link)
    .then(response => {
        qrcode = response['base64'];
        logger.debug('qr code generated');
        return upiPayLinks.findOne({vpa});
    })
    .then((card) =>{
        if(!card){
            if(amount){
                return upiPayLinks.create({
                    payeeName,amount,reason,vpa,qrcode,bgColor,logo
                });
            }else{
                return upiPayLinks.create({
                    payeeName,amount,reason,vpa,qrcode,bgColor,logo
                });
            }
        }else{
            logger.debug('card already exists update card info');
            if(amount){
                return upiPayLinks.updateOne({vpa},{payeeName,amount,reason,vpa,qrcode,bgColor,logo}).then(() => {
                    return upiPayLinks.findOne({vpa});
                })
            }
            else{
                return upiPayLinks.updateOne({vpa},{payeeName,reason,vpa,qrcode,bgColor,logo}).then(() => {
                    return upiPayLinks.findOne({vpa});
                })
            }
        }
    })
    .then(createdCard =>{
        logger.debug('card created successfully');
        res.json(createdCard);
    })
    .catch(err =>{
        logger.error(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(apiUtils.getError(err.message,HttpStatus.INTERNAL_SERVER_ERROR));
    })  
})

router.get('/getupiCard/:vpa',(req,res)=>{
    let {vpa} = req.params;
    logger.debug(`finding info for ${vpa}`);
    upiPayLinks.findOne({vpa})
    .then(cardInfo =>{
        if(cardInfo)
        return res.json(cardInfo);
        else
        return Promise.reject('card not found');
    })
    .catch(err =>{
        logger.error(err);
        return res.status(HttpStatus.NOT_FOUND).json(apiUtils.getError(err,HttpStatus.NOT_FOUND));
    })
})

router.get('/totalUpiCards', (req,res)=>{
    upiPayLinks.count().then(count => {
        logger.debug(`total card are ${count}`);
        res.json({count});
    })
    .catch(err => {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(apiUtils.getError(err,HttpStatus.INTERNAL_SERVER_ERROR))
    })
})

module.exports = router;