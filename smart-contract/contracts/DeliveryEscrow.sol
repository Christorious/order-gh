// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DeliveryEscrow
 * @dev This contract acts as a "digital judge" to track the status of deliveries.
 * It does not hold funds but provides a verifiable, on-chain record of a delivery's lifecycle.
 */
contract DeliveryEscrow {
    // The owner of the contract, who can manage certain aspects.
    address public owner;

    // Enum to represent the state of a delivery.
    enum DeliveryState {
        Created,      // The delivery has been requested by the sender.
        Accepted,     // A rider has accepted the delivery.
        SenderConfirmed, // The sender has confirmed the delivery is complete.
        RiderConfirmed,  // The rider has confirmed the delivery is complete.
        Completed,    // Both parties have confirmed.
        Disputed      // One of the parties has disputed the delivery.
    }

    // Struct to hold the details of a delivery.
    struct Delivery {
        bytes32 requestId;       // Unique ID for the delivery, from our backend.
        address sender;          // The sender's wallet address.
        address rider;           // The rider's wallet address.
        DeliveryState state;     // The current state of the delivery.
    }

    // Mapping from the requestId to the Delivery struct.
    mapping(bytes32 => Delivery) public deliveries;

    // Events to notify off-chain applications of state changes.
    event DeliveryCreated(bytes32 indexed requestId, address indexed sender);
    event DeliveryAccepted(bytes32 indexed requestId, address indexed rider);
    event DeliveryConfirmed(bytes32 indexed requestId, address indexed confirmer, DeliveryState newState);
    event DeliveryCompleted(bytes32 indexed requestId);
    event DeliveryDisputed(bytes32 indexed requestId, address indexed disputer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

    modifier onlySender(bytes32 _requestId) {
        require(msg.sender == deliveries[_requestId].sender, "Only the sender can call this function.");
        _;
    }

    modifier onlyRider(bytes32 _requestId) {
        require(msg.sender == deliveries[_requestId].rider, "Only the rider can call this function.");
        _;
    }

    /**
     * @dev Sets the contract owner upon deployment.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Creates a new delivery record. Can only be called by the owner (our backend).
     * @param _requestId The unique ID of the delivery.
     * @param _sender The wallet address of the sender.
     */
    function createDelivery(bytes32 _requestId, address _sender) external onlyOwner {
        require(deliveries[_requestId].sender == address(0), "Delivery with this ID already exists.");

        deliveries[_requestId] = Delivery({
            requestId: _requestId,
            sender: _sender,
            rider: address(0),
            state: DeliveryState.Created
        });

        emit DeliveryCreated(_requestId, _sender);
    }

    /**
     * @dev Allows a rider to accept a delivery.
     * @param _requestId The ID of the delivery to accept.
     */
    function acceptDelivery(bytes32 _requestId) external {
        Delivery storage delivery = deliveries[_requestId];
        require(delivery.state == DeliveryState.Created, "Delivery is not in the Created state.");
        require(msg.sender != delivery.sender, "The sender cannot be the rider.");

        delivery.rider = msg.sender;
        delivery.state = DeliveryState.Accepted;

        emit DeliveryAccepted(_requestId, msg.sender);
    }

    /**
     * @dev Allows the sender or rider to confirm a completed delivery.
     * @param _requestId The ID of the delivery to confirm.
     */
    function confirmDelivery(bytes32 _requestId) external {
        Delivery storage delivery = deliveries[_requestId];
        require(delivery.state == DeliveryState.Accepted || delivery.state == DeliveryState.SenderConfirmed || delivery.state == DeliveryState.RiderConfirmed, "Delivery cannot be confirmed in its current state.");
        require(msg.sender == delivery.sender || msg.sender == delivery.rider, "Only the sender or rider can confirm.");

        bool isSender = msg.sender == delivery.sender;
        bool isRider = msg.sender == delivery.rider;

        // Check if the other party has already confirmed
        if ((isSender && delivery.state == DeliveryState.RiderConfirmed) || (isRider && delivery.state == DeliveryState.SenderConfirmed)) {
            delivery.state = DeliveryState.Completed;
            emit DeliveryCompleted(_requestId);
        } else {
            if (isSender) {
                delivery.state = DeliveryState.SenderConfirmed;
                emit DeliveryConfirmed(_requestId, msg.sender, DeliveryState.SenderConfirmed);
            } else { // isRider
                delivery.state = DeliveryState.RiderConfirmed;
                emit DeliveryConfirmed(_requestId, msg.sender, DeliveryState.RiderConfirmed);
            }
        }
    }

    /**
     * @dev Allows either party to dispute a delivery.
     * @param _requestId The ID of the delivery to dispute.
     */
    function disputeDelivery(bytes32 _requestId) external {
        Delivery storage delivery = deliveries[_requestId];
        require(msg.sender == delivery.sender || msg.sender == delivery.rider, "Only the sender or rider can dispute.");
        require(delivery.state != DeliveryState.Completed, "Cannot dispute a completed delivery.");

        delivery.state = DeliveryState.Disputed;
        emit DeliveryDisputed(_requestId, msg.sender);
    }
}
