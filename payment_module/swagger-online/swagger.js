const swaggerUi = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, '/swagger.yaml'));
const router = require('express').Router();
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

swaggerDocument.host=config.base_url;
router.use('/online', swaggerUi.serve);
router.get('/online', swaggerUi.setup(swaggerDocument));

module.exports = router;