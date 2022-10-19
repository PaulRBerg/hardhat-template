// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./BaseFixture.sol";
import "../Vault.sol";

contract VaultTest is BaseFixture {
    function setUp() public override {
        BaseFixture.setUp();
    }

    function testDepositEth() public {
        uint256 balanceBefore = depositer.balance;

        vm.startPrank(depositer);

        // with message called
        (bool success, ) = depositer.call{ value: 1 ether }("depositETH");
        assertTrue(success);

        uint256 balanceAfter = depositer.balance;
        assertEq(balanceAfter, balanceBefore - 1 ether);

        vm.stopPrank();
    }
}
