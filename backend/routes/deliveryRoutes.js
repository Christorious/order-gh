const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { verifySignature } = require('../middleware/auth');

router.post('/delivery-requests', verifySignature, deliveryController.createDeliveryRequest);

module.exports = router;
