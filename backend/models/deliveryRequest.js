class DeliveryRequest {
  constructor(pickupLocation, dropoffLocation, itemDescription, itemWeight, itemDimensions, deliverySpeed, recipientIdentifier, signerAddress) {
    this.id = Date.now().toString();
    this.signerAddress = signerAddress;
    this.pickupLocation = pickupLocation;
    this.dropoffLocation = dropoffLocation;
    this.itemDescription = itemDescription;
    this.itemWeight = itemWeight;
    this.itemDimensions = itemDimensions;
    this.deliverySpeed = deliverySpeed;
    this.recipientIdentifier = recipientIdentifier;
    this.status = 'pending';
    this.createdAt = new Date();
  }
}

module.exports = DeliveryRequest;
