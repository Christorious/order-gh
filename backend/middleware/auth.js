const { ethers } = require('ethers');

const verifySignature = (req, res, next) => {
  const { signature, signerAddress, ...deliveryDetails } = req.body;

  if (!signature || !signerAddress) {
    return res.status(401).json({ message: 'Missing signature or signerAddress' });
  }

  try {
    const message = JSON.stringify(deliveryDetails);
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== signerAddress.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Attach the verified address to the request object for later use
    req.verifiedSignerAddress = recoveredAddress;
    next();
  } catch (error) {
    console.error('Signature verification error:', error);
    res.status(500).json({ message: 'Error verifying signature' });
  }
};

module.exports = {
  verifySignature,
};
