const swaggerUi = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, '/swagger.yaml'));
const router = require('express').Router();

router.use('/offline', swaggerUi.serve);
router.get('/offline', swaggerUi.setup(swaggerDocument));

module.exports = router;