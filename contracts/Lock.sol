// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.9;

error InvalidUnlockTime(uint256 unlockTime);
error NotOwner(address owner);
error UnlockTimeNotReached(uint256 unlockTime);

contract Lock {
    uint256 public unlockTime;
    address payable public owner;

    event Withdrawal(uint256 amount, uint256 when);

    constructor(uint256 _unlockTime) payable {
        if (block.timestamp >= _unlockTime) {
            revert InvalidUnlockTime(_unlockTime);
        }

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        if (block.timestamp < unlockTime) {
            revert UnlockTimeNotReached(unlockTime);
        }

        if (msg.sender != owner) {
            revert NotOwner(owner);
        }

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
