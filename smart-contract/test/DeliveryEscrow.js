const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeliveryEscrow", function () {
  let deliveryEscrow, owner, sender, rider;
  const requestId = "0x746573742d726571756573742d31000000000000000000000000000000000000"; // "test-request-1" as bytes32

  beforeEach(async function () {
    [owner, sender, rider] = await ethers.getSigners();
    const DeliveryEscrowFactory = await ethers.getContractFactory("DeliveryEscrow");
    deliveryEscrow = await DeliveryEscrowFactory.deploy();
    await deliveryEscrow.waitForDeployment();
  });

  it("Should set the right owner", async function () {
    expect(await deliveryEscrow.owner()).to.equal(owner.address);
  });

  it("Should allow the owner to create a delivery", async function () {
    await expect(deliveryEscrow.connect(owner).createDelivery(requestId, sender.address))
      .to.emit(deliveryEscrow, "DeliveryCreated")
      .withArgs(requestId, sender.address);

    const delivery = await deliveryEscrow.deliveries(requestId);
    expect(delivery.sender).to.equal(sender.address);
    expect(delivery.state).to.equal(0); // Created
  });

  it("Should allow a rider to accept a delivery", async function () {
    await deliveryEscrow.connect(owner).createDelivery(requestId, sender.address);

    await expect(deliveryEscrow.connect(rider).acceptDelivery(requestId))
      .to.emit(deliveryEscrow, "DeliveryAccepted")
      .withArgs(requestId, rider.address);

    const delivery = await deliveryEscrow.deliveries(requestId);
    expect(delivery.rider).to.equal(rider.address);
    expect(delivery.state).to.equal(1); // Accepted
  });

  it("Should allow both parties to confirm a delivery", async function () {
    await deliveryEscrow.connect(owner).createDelivery(requestId, sender.address);
    await deliveryEscrow.connect(rider).acceptDelivery(requestId);

    await deliveryEscrow.connect(sender).confirmDelivery(requestId);
    let delivery = await deliveryEscrow.deliveries(requestId);
    expect(delivery.state).to.equal(2); // SenderConfirmed

    await deliveryEscrow.connect(rider).confirmDelivery(requestId);
    delivery = await deliveryEscrow.deliveries(requestId);
    expect(delivery.state).to.equal(4); // Completed
  });

  it("Should allow a party to dispute a delivery", async function () {
    await deliveryEscrow.connect(owner).createDelivery(requestId, sender.address);
    await deliveryEscrow.connect(rider).acceptDelivery(requestId);

    await expect(deliveryEscrow.connect(sender).disputeDelivery(requestId))
      .to.emit(deliveryEscrow, "DeliveryDisputed")
      .withArgs(requestId, sender.address);

    const delivery = await deliveryEscrow.deliveries(requestId);
    expect(delivery.state).to.equal(5); // Disputed
  });
});
