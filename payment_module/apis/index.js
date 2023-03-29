const cors = require('cors');
const open_api_offline = require('../swagger-offline/swagger');
const open_api_online = require('../swagger-online/swagger');
const health = require('../routes/health');
const upi_links = require('../routes/upi_qr_links')
const app_apis = require("../routes/app");
const bill_apis = require("../routes/bill");
const kyc_apis = require("../routes/kyc");
const user_apis = require('../routes/user');
const transactions_apis = require('../routes/transaction');
const webhook_apis = require('../routes/webhook');
const express = require('express');
const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors());
app.use(express.json());
app.use('/openapi',[open_api_offline,open_api_online]);
app.use('/offline',[health,upi_links]);
app.use('/online',[health,user_apis,app_apis,kyc_apis,bill_apis,webhook_apis,transactions_apis])

module.exports = app;