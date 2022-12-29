// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    uint256 public unlockTime;
    address payable public owner;

    error InvalidUnlockTime(uint256 unlockTime);
    error UnlockTimeNotReach(uint256 unlockTime);
    error NotOwner(address owner);

    event Withdrawal(uint256 amount, uint256 when);

    constructor(uint256 _unlockTime) payable {
        if (block.timestamp > _unlockTime) {
            revert InvalidUnlockTime(_unlockTime);
        }

        unlockTime = _unlockTime;
        // Uncomment this line, you can use console.log to print the unlockTime.
        // console.log(unlockTime);
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        if (block.timestamp < unlockTime) {
            revert UnlockTimeNotReach(unlockTime);
        }
        if (msg.sender != owner) {
            revert NotOwner(owner);
        }

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
