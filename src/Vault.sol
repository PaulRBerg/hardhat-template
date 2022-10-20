// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IWETH9 } from "advanced-weth/contracts/interfaces/IWETH9.sol";
import {
    ReentrancyGuardUpgradeable
} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import { PausableUpgradeable } from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { ProxyAdmin } from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

// @dev a fake vault deposit, only can deposit but not withdraw
contract Vault is ReentrancyGuardUpgradeable, OwnableUpgradeable, PausableUpgradeable {
    using SafeERC20 for IERC20;

    enum VaultType {
        CALL,
        PUT
    }

    struct VaultParams {
        // Option type the vault is selling
        VaultType vaultType;
        // Token decimals for vault shares
        uint8 decimals;
        // Asset used in Theta / Delta Vault
        address asset;
        // Vault cap
        uint256 cap;
    }

    VaultParams public vaultParams;
    address public WETH;

    mapping(address => uint256) public balanceOf;

    function initialize(address _weth, Vault.VaultParams calldata _vaultParams) public initializer {
        require(_weth != address(0), "!_weth");

        __ReentrancyGuard_init();
        __Ownable_init();
        __Pausable_init();

        WETH = _weth;
        vaultParams = _vaultParams;
    }

    function totalBalance() public view returns (uint256) {
        return uint256(IERC20(vaultParams.asset).balanceOf(address(this)));
    }

    function depositETH() external payable whenNotPaused nonReentrant {
        require(msg.value > 0, "!value");
        require(vaultParams.asset == WETH, "!eth vault");

        IWETH9(payable(WETH)).deposit{ value: msg.value }();

        _depositFor(msg.value, msg.sender);
    }

    function deposit(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "!amount");

        _depositFor(amount, msg.sender);

        // An approve() by the msg.sender is required beforehand
        IERC20(vaultParams.asset).safeTransferFrom(msg.sender, address(this), amount);
    }

    function _depositFor(uint256 amount, address creditor) private {
        uint256 totalWithDepositedAmount = IERC20(vaultParams.asset).balanceOf(address(this)) + amount;
        require(totalWithDepositedAmount <= vaultParams.cap, "Exceed cap");
        balanceOf[creditor] += amount;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
