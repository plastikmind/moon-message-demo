// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// MoonMessage deployed to  0xeeB73293Ee03e6D2E65b240521b64280458b08e2

contract MoonMessage {
    // Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // Address of contract deployer. Marked payable so that we can withdraw to this address later.
    address payable owner;

    // List of all memos received.
    Memo[] memos;

    // constructors only deployed once when a contract is created.
    //Store the address of the deployer as a payable address
    // When we withdraw funds, we'll withdraw here.
    constructor() {
        owner = payable(msg.sender);
    }

    // fetch all stored memos

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
     * @dev send eth with memo
     * @param _name name of the sender
     * @param _message a message from the sender
     */

    function sendToMoon(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "can't go to moon without ETH");

        // Add the memo to storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        // Emit a NewMemo event with details about the memo
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }
}
