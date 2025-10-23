const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

router.post('/delivery-requests', deliveryController.createDeliveryRequest);

module.exports = router;
