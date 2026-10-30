// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.9;

error InvalidUnlockTime(uint256 unlockTime);
error NotOwner(address owner);
error UnlockTimeNotReached(uint256 unlockTime);

/// @title Time-locked ether
/// @author Paul Razvan Berg
/// @notice Locks ether until the owner withdraws it after the unlock time.
contract Lock {
    /// @notice The earliest timestamp at which the owner can withdraw.
    uint256 public unlockTime;
    /// @notice The account allowed to withdraw the locked ether.
    address payable public owner;

    /// @notice Emitted when the owner withdraws the locked ether.
    /// @param amount The amount of ether withdrawn, in wei.
    /// @param when The timestamp of the withdrawal.
    event Withdrawal(uint256 amount, uint256 when);

    constructor(uint256 _unlockTime) payable {
        if (block.timestamp >= _unlockTime) {
            revert InvalidUnlockTime(_unlockTime);
        }

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    /// @notice Transfers all locked ether to the owner once the unlock time is reached.
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
