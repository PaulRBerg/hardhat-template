// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "forge-std/Vm.sol";
import "forge-std/Test.sol";
import "./utils/Utils.sol";
import "./utils/Erc20Utils.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../TokenX.sol";
import "../VaultV2.sol";
import "forge-std/console.sol";

contract BaseFixtureV2 is Test, Utils {
    Erc20Utils immutable erc20utils = new Erc20Utils();

    address constant weth_address = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    IERC20 weth = IERC20(weth_address);
    TokenX tokenX = new TokenX();

    VaultV2 ethVault = new VaultV2();
    VaultV2 tokenXVault = new VaultV2();

    address immutable depositer = getAddress("depositer");

    function setUp() public virtual {
        ethVault.initialize(
            address(weth),
            VaultV2.VaultParams({
                vaultType: VaultV2.VaultType.CALL,
                decimals: 18,
                asset: address(weth),
                cap: 1000 ether
            })
        );

        tokenXVault.initialize(
            address(weth),
            VaultV2.VaultParams({
                vaultType: VaultV2.VaultType.CALL,
                decimals: 18,
                asset: address(tokenX),
                cap: 100 ether
            })
        );

        // label addresses
        vm.label(address(this), "this");
        vm.label(depositer, "depositer");
        vm.label(address(weth), "weth");
        vm.label(address(tokenX), "tokenX");
        vm.label(address(ethVault), "ethVault");
        vm.label(address(tokenXVault), "tokenXVault");
        vm.label(HEVM_ADDRESS, "hevm");

        // https://book.getfoundry.sh/cheatcodes/

        // send out tokens
        vm.deal(address(this), 1 ether);
        vm.deal(depositer, 7 ether);
        // cheat: force mint token balance
        erc20utils.forceMintTo(address(depositer), address(weth), 8 ether);
        tokenX.mint(address(depositer), 1000 ether);

        // assertion
        assertEq(depositer.balance, 7 ether);
        assertEq(weth.balanceOf(depositer), 8 ether);
        assertEq(tokenX.balanceOf(depositer), 1000 ether);

        // cheat: impersonate another user
        vm.startPrank(depositer);
        tokenX.approve(address(tokenXVault), 2**256 - 1);
        vm.stopPrank();

        // cheat: manipulate block timestamp
        // vm.warp(block.timestamp + 200);
        // cheat: manipulate block number
        // vm.roll(block.number + 1)
    }
}
