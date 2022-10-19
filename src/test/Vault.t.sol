// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./BaseFixture.sol";
import "../Vault.sol";
import "forge-std/console.sol";

contract VaultTest is BaseFixture {
    function setUp() public override {
        BaseFixture.setUp();
    }

    function testDepositEth() public {
        uint256 balanceBefore = depositer.balance;

        vm.startPrank(depositer);

        // with message called
        ethVault.depositETH{ value: 1 ether }();

        uint256 balanceAfter = depositer.balance;
        assertEq(balanceAfter, balanceBefore - 1 ether);

        uint256 balanceVault = ethVault.balanceOf(address(depositer));
        assertEq(balanceVault, 1 ether);

        vm.stopPrank();
    }

    function testDepositEthToNonEthVault() public {
        uint256 balanceBefore = depositer.balance;

        vm.startPrank(depositer);

        // with message called
        vm.expectRevert();
        tokenXVault.depositETH{ value: 1 ether }();

        uint256 balanceAfter = depositer.balance;
        assertEq(balanceAfter, balanceBefore);

        uint256 balanceVault = tokenXVault.balanceOf(address(depositer));
        assertEq(balanceVault, 0);

        vm.stopPrank();
    }

    function testDepositErc20() public {
        uint256 balanceBefore = tokenX.balanceOf(depositer);

        vm.startPrank(depositer);

        tokenXVault.deposit(1 ether);

        uint256 balanceAfter = tokenX.balanceOf(depositer);
        assertEq(balanceAfter, balanceBefore - 1 ether);

        vm.stopPrank();
    }

    function testDepositExceedsCap() public {
        uint256 balanceBefore = tokenX.balanceOf(depositer);

        vm.startPrank(depositer);

        vm.expectRevert();
        tokenXVault.deposit(1000 ether);

        uint256 balanceAfter = tokenX.balanceOf(depositer);
        assertEq(balanceAfter, balanceBefore);

        vm.stopPrank();
    }

    function testOnlyOwnerCanPause() public {
        vm.startPrank(depositer);

        vm.expectRevert();
        tokenXVault.pause();

        vm.stopPrank();

        tokenXVault.pause();
    }

    function testOnlyOwnerCanUnpause() public {
        tokenXVault.pause();

        vm.startPrank(depositer);

        vm.expectRevert();
        tokenXVault.unpause();

        vm.stopPrank();

        tokenXVault.unpause();
    }

    function testCannotDepositETHWhenPaused() public {
        ethVault.pause();

        vm.startPrank(depositer);
        vm.expectRevert();
        ethVault.depositETH{ value: 1 ether }();
        vm.stopPrank();

        ethVault.unpause();

        vm.startPrank(depositer);
        ethVault.depositETH{ value: 1 ether }();
        vm.stopPrank();
    }

    function testCannotDepositWhenPaused() public {
        tokenXVault.pause();

        vm.startPrank(depositer);
        vm.expectRevert();
        tokenXVault.deposit(1 ether);
        vm.stopPrank();

        tokenXVault.unpause();

        vm.startPrank(depositer);
        tokenXVault.deposit(1 ether);
        vm.stopPrank();
    }
}
