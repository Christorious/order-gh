const DeliveryRequest = require('../models/deliveryRequest');

// For now, we'll store requests in memory.
const deliveryRequests = [];

const createDeliveryRequest = (req, res) => {
  const {
    pickupLocation,
    dropoffLocation,
    itemDescription,
    itemWeight,
    itemDimensions,
    deliverySpeed,
    recipientIdentifier,
  } = req.body;

  if (!pickupLocation || !dropoffLocation || !itemDescription) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newRequest = new DeliveryRequest(
    pickupLocation,
    dropoffLocation,
    itemDescription,
    itemWeight,
    itemDimensions,
    deliverySpeed,
    recipientIdentifier
  );

  deliveryRequests.push(newRequest);

  res.status(201).json(newRequest);
};

module.exports = {
  createDeliveryRequest,
};
