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
    signature,
    signerAddress,
  } = req.body;

  if (!pickupLocation || !dropoffLocation || !itemDescription || !signature || !signerAddress) {
    return res.status(400).json({ message: 'Missing required fields, including signature and signerAddress' });
  }

  // The signature has been verified by the middleware.
  const newRequest = new DeliveryRequest(
    pickupLocation,
    dropoffLocation,
    itemDescription,
    itemWeight,
    itemDimensions,
    deliverySpeed,
    recipientIdentifier,
    req.verifiedSignerAddress // Pass the verified address to the model
  );

  deliveryRequests.push(newRequest);

  res.status(201).json(newRequest);
};

module.exports = {
  createDeliveryRequest,
};
