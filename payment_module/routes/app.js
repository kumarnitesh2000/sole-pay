const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const globalConstant = require("../utils/globalConstant");
const authenticate = require("../middlewares/authenticate");
const validate_app = require("../middlewares/validate_app");
const merchant_app_admin = require("../middlewares/merchant_app_admin");
const HttpStatus = require("http-status-codes");
const validate_admin = require("../middlewares/validate_admin");
const mongoose = require("mongoose");

const {
  getMerchantById,
  addMerchantInApp,
  addAppInMerchant,
  updateAppCallBack,
} = require("../utils/queryUtils");
const ErrorResponse = require("../utils/errorResponse");
const appModel = require("../models/app");
const secretKeyUtil = require("../utils/secretKeyUtil");
const merchant_in_app = require("../middlewares/merchant_in_app");

/**
 * verify the merchant
 * create an app document
 * add merchant in merchantList under created app with isAdmin - true
 * add app in merchant documet under appList
 */
router.post("/app", [authenticate], async (req, res) => {
  logger.debug("registering a app");
  const { userId } = req.jwt;
  const { appName } = req.body;
  let appId, merchant, app, appSecret;
  let session = await mongoose.startSession();
  getMerchantById(userId)
    .then((user) => {
      if (user != null) {
        merchant = user;
        logger.debug("merchant verification done");
        appSecret = secretKeyUtil.createSecretKey();
        let finalHash = secretKeyUtil.hashedSecretToStore(
          appSecret,
          secretKeyUtil.readPublicPEMFile
        );
        return appModel.create({
          appName,
          appSecret: finalHash,
        });
      }
      throw new ErrorResponse("user is not a merchant or invalid token", 400);
    })
    .then((_app) => {
      app = _app;
      appId = app[globalConstant.UNDERSCORE_ID];
      logger.debug(`app created: ${appName}`);
      session.startTransaction();
      return Promise.all([
        addMerchantInApp(merchant, appId, true),
        addAppInMerchant(app, userId),
      ]);
    })
    .then((promiseList) => {
      logger.debug("verify the write queries");
      promiseList.forEach((element) => {
        if (element["ok"] == 0) {
          logger.debug("update operation fails");
          session.abortTransaction();
          return appModel.deleteOne({ [globalConstant.UNDERSCORE_ID]: appId });
        }
      });
      return session.commitTransaction();
    })
    .then((deletedApp) => {
      if (deletedApp)
        throw new ErrorResponse(
          "can't able to create app successfully, please try again",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      session.endSession();
      return res.json({ appId, appSecret });
    })
    .catch((err) => {
      return res
        .status(err.status)
        .json(new ErrorResponse(err.message, err.status));
    });
});

router.get("/app", [authenticate], (req, res) => {
  const { userId } = req.jwt;
  getMerchantById(userId)
    .then((merchant) => {
      if (merchant == null) throw new ErrorResponse("merchant not exist", 404);
      let appFindPromiseList = [];
      merchant.appList.forEach((app) => {
        appFindPromiseList.push(appModel.findById(app["appId"]));
      });
      return Promise.all(appFindPromiseList);
    })
    .then((apps) => {
      if (!apps.length)
        throw new ErrorResponse("merchant does'nt have any apps", 200);
      return res.json(apps);
    })
    .catch((err) => {
      return res
        .status(err.status)
        .json(new ErrorResponse(err.message, err.status).getErrorResponse());
    });
});

router.get("/app/details", [validate_app], (req, res) => {
  res.json(req.app);
});

router.put("/app", [validate_app, merchant_app_admin], (req, res) => {
  const appId = req.app[globalConstant.UNDERSCORE_ID];
  const { callbackUrl, callbackSecret } = req.body;
  updateAppCallBack({ appId, callbackUrl, callbackSecret })
    .then((_) => {
      return appModel.findById(appId);
    })
    .then((app) => {
      res.json(app);
    })
    .catch((err) => {
      if (!err.status) err.status = 500;
      return res
        .status(err.status)
        .json(new ErrorResponse(err.message, err.status).getErrorResponse());
    });
});

router.patch("/app", [merchant_app_admin], (req, res) => {
  let { merchantId, appId } = req.ids;
  logger.debug("generating new app_secrets");
  let appSecret = secretKeyUtil.createSecretKey();
  let finalHash = secretKeyUtil.hashedSecretToStore(
    appSecret,
    secretKeyUtil.readPublicPEMFile
  );
  appModel
    .updateOne(
      {
        [globalConstant.UNDERSCORE_ID]: appId,
        merchantList: { $elemMatch: { merchantId, isAdmin: true } },
      },
      { $set: { appSecret: finalHash } }
    )
    .then((_) => {
      res.json({ appSecret });
    })
    .catch((err) => {
      if (!err.status) err.status = 500;
      return res
        .status(err.status)
        .json(new ErrorResponse(err.message, err.status).getErrorResponse());
    });
});

/**
 * validate that is admin level app already created or not
 */
router.post("/app/admin", [validate_admin], (req, res) => {
  logger.debug("creating main level app");
  let appSecret;
  const { appName } = req.body;
  appModel
    .findOne({ isMainApp: true })
    .then((app) => {
      if (app != null)
        throw new ErrorResponse("admin level app is already created", 400);
      appSecret = secretKeyUtil.createSecretKey();
      let finalHash = secretKeyUtil.hashedSecretToStore(
        appSecret,
        secretKeyUtil.readPublicPEMFile
      );
      return appModel.create({
        appName,
        appSecret: finalHash,
        isMainApp: true,
      });
    })
    .then((app) => {
      return res.json({ appId: app[globalConstant.UNDERSCORE_ID], appSecret });
    })
    .catch((err) => {
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      if(err.status){
        status = err.status;
      }
      return res.status(status).json(
        new ErrorResponse(
          err.message,
          status
        )
      );
    });
});

module.exports = router;
