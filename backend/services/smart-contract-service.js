const { ethers } = require("ethers");
require("dotenv").config();
const contractABI = require("../../smart-contract/artifacts/contracts/DeliveryEscrow.sol/DeliveryEscrow.json").abi;

// The address of the deployed contract on our local Hardhat node
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Connect to the local Hardhat node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Use the private key from the environment variable for the owner/backend wallet
const ownerWallet = new ethers.Wallet(process.env.BACKEND_WALLET_PRIVATE_KEY, provider);

const deliveryEscrowContract = new ethers.Contract(contractAddress, contractABI, ownerWallet);

/**
 * Calls the createDelivery function on the smart contract.
 * @param {string} requestId - The unique ID of the delivery.
 * @param {string} senderAddress - The sender's wallet address.
 */
async function createDeliveryOnChain(requestId, senderAddress) {
  try {
    const tx = await deliveryEscrowContract.createDelivery(requestId, senderAddress);
    await tx.wait(); // Wait for the transaction to be mined
    console.log(`Delivery ${requestId} created on-chain. Transaction hash: ${tx.hash}`);
    return tx.hash;
  } catch (error) {
    console.error("Error creating delivery on-chain:", error);
    throw new Error("Failed to create delivery on the blockchain.");
  }
}

module.exports = {
  createDeliveryOnChain,
};
