// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

contract Erc20Utils is Test {
    using stdStorage for StdStorage;

    function forceMintTo(
        address account,
        address token,
        uint256 amount
    ) public {
        stdstore.target(token).sig(bytes4(keccak256("balanceOf(address)"))).with_key(account).checked_write(
            balanceOf(token, account) + amount
        );

        // stdstore.target(token).sig(bytes4(keccak256("totalSupply()"))).checked_write(totalSupply(token) + amount);
    }

    function forceMint(address token, uint256 amount) external {
        forceMintTo(msg.sender, token, amount);
    }

    function forceBurnFrom(
        address account,
        address token,
        uint256 amount
    ) public {
        stdstore.target(token).sig(bytes4(keccak256("balanceOf(address)"))).with_key(account).checked_write(
            balanceOf(token, account) - amount
        );

        // stdstore.target(token).sig(bytes4(keccak256("totalSupply()"))).checked_write(totalSupply(token) - amount);

        // Should be emitted by token contract
        // emit ERC20.Transfer(account, address(0), amount);
    }

    function forceBurn(address token, uint256 amount) external {
        forceBurnFrom(msg.sender, token, amount);
    }

    // ============================
    // ===== Internal helpers =====
    // ============================

    function balanceOf(address token, address account) private view returns (uint256) {
        (, bytes memory rdat) = token.staticcall(abi.encodeWithSignature("balanceOf(address)", account));
        return abi.decode(rdat, (uint256));
    }

    function totalSupply(address token) private view returns (uint256) {
        (, bytes memory rdat) = token.staticcall(abi.encodeWithSignature("totalSupply()"));
        return abi.decode(rdat, (uint256));
    }
}
