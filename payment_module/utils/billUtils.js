const logger = require("../utils/logger");
const globalConstants = require("../utils/globalConstant");
const axios = require("axios");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const HttpStatus = require("http-status-codes");
const ErrorResponse = require("../utils/errorResponse");

/**
 *
 * @param {*} billerId
 * @param {*} paymentGateway
 * @param {*} minAmount
 * @param {*} maxAmount
 * @returns
 */
exports.generatePayMentLink = (
  billerId,
  paymentGateway,
  minAmount,
  maxAmount,
  merchantName
) => {
  logger.debug(
    `create a payment_link at: ${paymentGateway} with billerId: ${billerId}`
  );
  switch (paymentGateway) {
    case globalConstants.RAZORPAY:
      razorpay_config = this.razorpayPaymentLinkConfig(
        minAmount,
        maxAmount,
        billerId
      );
      return axios(razorpay_config);
    case globalConstants.MOCKPAY:
      mockpay_config = this.mockpayPaymentLinkConfig(
        minAmount,
        maxAmount,
        billerId,
        merchantName
      );
      return axios(mockpay_config);
    default:
      throw new ErrorResponse(
        `currently payment gateway: ${paymentGateway} not supported`,
        HttpStatus.BAD_REQUEST
      );
  }
};

/**
 *
 * @param {*} minAmount
 * @param {*} maxAmount
 * @param {*} reference_id
 */
exports.razorpayPaymentLinkConfig = (minAmount, maxAmount, reference_id) => {
  const data = {
    amount: maxAmount * 100,
    currency: "INR",
    accept_partial: true,
    first_min_partial_amount: minAmount * 100,
    reference_id,
  };
  var _config = {
    method: "post",
    url: config.razorpay_url,
    headers: {
      Authorization: `Basic ${config.razorpay_token}`,
      "Content-Type": "application/json",
    },
    data,
  };
  logger.debug("config created for paymentGateway");
  return _config;
};

/**
 *
 * @param {*} minAmount
 * @param {*} maxAmount
 * @param {*} reference_id
 */
exports.mockpayPaymentLinkConfig = (
  minAmount,
  maxAmount,
  biller_id,
  merchantName
) => {
  let scheme = env=='development' ? 'http' : 'https';
  let callback_url = `${scheme}://${config.base_url}/online/webhook/mockpay/notifications`;
  logger.debug(`callback_url: ${callback_url}`);
  const data = {
    first_min_amount: minAmount,
    biller_id,
    payee_name: merchantName,
    max_amount: maxAmount,
    callback_url,
  };
  var _config = {
    method: "post",
    url: config.mockpay_url,
    headers: {
      Authorization: `Basic ${config.mockpay_token}`,
      "Content-Type": "application/json",
    },
    data,
  };
  logger.debug("config created for paymentGateway");
  return _config;
};

/**
 *
 * @param {*} response
 * @param {*} paymentGateway
 */
exports.extractPaymentGateWayInfo = (response, paymentGateway) => {
  switch (paymentGateway) {
    case globalConstants.RAZORPAY:
      const { id, short_url } = response.data;
      return { platformId: id, paymentGateway, paymentLink: short_url };
    case globalConstants.MOCKPAY:
      const { platform_id, payment_link } = response.data;
      return { platformId: platform_id, paymentGateway, paymentLink: payment_link };
    default:
      throw new ErrorResponse(
        `currently payment gateway: ${paymentGateway} not supported`,
        HttpStatus.BAD_REQUEST
      );
  }
};

/**
 * 
 * @param {*} status 
 * @returns status for bill db
 */
exports.decodeMockPayStatus = (status) => {
  switch(status){
    case "paid":
      return "payment_bill.paid";
    case "partially_paid":
      return "payment_bill.partially_paid";
    case "failed":
      return "payment_bill.failed";
    default:
      throw new ErrorResponse(
        `mockpay not supported status: ${status}`,
        HttpStatus.BAD_REQUEST
      );

  }
}