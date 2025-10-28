const { ethers } = require("hardhat");

async function main() {
  const DeliveryEscrow = await ethers.getContractFactory("DeliveryEscrow");
  const deliveryEscrow = await DeliveryEscrow.deploy();

  await deliveryEscrow.waitForDeployment();

  const address = await deliveryEscrow.getAddress();
  console.log("DeliveryEscrow deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
