// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./BaseFixtureV2.sol";
import "../Vault.sol";
import "forge-std/console.sol";

contract VaultV2Test is BaseFixtureV2 {
    function setUp() public override {
        BaseFixtureV2.setUp();
    }

    function depositEth(uint256 amount) public {
        uint256 balanceBefore = depositer.balance;

        vm.startPrank(depositer);

        // with message called
        ethVault.depositETH{ value: amount }();

        uint256 balanceAfter = depositer.balance;
        assertEq(balanceAfter, balanceBefore - amount);

        uint256 balanceVault = ethVault.balanceOf(address(depositer));
        assertEq(balanceVault, amount);

        vm.stopPrank();
    }

    function testDepositEth() public {
        depositEth(2 ether);
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

    function deposit(
        IERC20 token,
        VaultV2 vault,
        uint256 amount
    ) public {
        uint256 balanceBefore = token.balanceOf(depositer);

        vm.startPrank(depositer);

        vault.deposit(amount);

        uint256 balanceAfter = token.balanceOf(depositer);
        assertEq(balanceAfter, balanceBefore - amount);

        vm.stopPrank();
    }

    function testDepositErc20() public {
        deposit(tokenX, tokenXVault, 3 ether);
    }

    // do some fuzz test
    function testFuzzDeposit(uint256 amount) public {
        (, , , uint256 cap) = tokenXVault.vaultParams();
        vm.assume(amount > 0 && amount < cap);

        deposit(tokenX, tokenXVault, amount);
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

    function withdraw(
        IERC20 token,
        VaultV2 vault,
        uint256 depositAmount,
        uint256 withdrawAmount
    ) public {
        deposit(token, vault, depositAmount);

        uint256 tokenBalanceBefore = token.balanceOf(depositer);

        vm.startPrank(depositer);
        if (depositAmount < withdrawAmount) {
            vm.expectRevert();
        }
        vault.withdraw(withdrawAmount);

        uint256 tokenBalanceAfter = token.balanceOf(depositer);
        assertEq(tokenBalanceAfter, tokenBalanceBefore + withdrawAmount);

        uint256 vaultBalance = vault.balanceOf(depositer);
        assertEq(vaultBalance, depositAmount - withdrawAmount);

        vm.stopPrank();
    }

    function testWithdraw() public {
        withdraw(tokenX, tokenXVault, 3 ether, 2 ether);
    }

    function testWithrawAll() public {
        deposit(tokenX, tokenXVault, 3 ether);

        uint256 tokenXBalanceBefore = tokenX.balanceOf(depositer);

        vm.startPrank(depositer);
        tokenXVault.withdrawAll();

        uint256 tokenXBalance = tokenX.balanceOf(depositer);
        assertEq(tokenXBalance, tokenXBalanceBefore + 3 ether);

        uint256 vaultBalance = tokenXVault.balanceOf(depositer);
        assertEq(vaultBalance, 0);

        vm.stopPrank();
    }

    // fuzz test withdraw
    function testFuzzWithdraw(uint256 depositAmount, uint256 withdrawAmount) public {
        (, , , uint256 cap) = tokenXVault.vaultParams();
        vm.assume(depositAmount > 0 && depositAmount <= cap);
        vm.assume(withdrawAmount > 0 && depositAmount >= withdrawAmount);
        withdraw(tokenX, tokenXVault, depositAmount, withdrawAmount);
    }
}
