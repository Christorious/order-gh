const { ethers } = require('ethers');
const DeliveryRequest = require('../models/deliveryRequest');
const { createDeliveryOnChain } = require('../services/smart-contract-service');

// For now, we'll store requests in memory.
const deliveryRequests = [];

const createDeliveryRequest = async (req, res) => {
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

  try {
    // Also create the delivery on-chain
    // Convert the request ID to bytes32, as expected by the contract
    const requestIdBytes32 = ethers.encodeBytes32String(newRequest.id);
    await createDeliveryOnChain(requestIdBytes32, newRequest.signerAddress);

    res.status(201).json(newRequest);
  } catch (error) {
    // If the on-chain creation fails, we should ideally roll back the in-memory creation.
    // For now, we'll just log the error and return a failure response.
    console.error("Failed to create delivery on-chain:", error);
    res.status(500).json({ message: "Failed to record delivery on the blockchain." });
  }
};

module.exports = {
  createDeliveryRequest,
};
