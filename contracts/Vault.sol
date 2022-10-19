// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Vault {
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
        // Underlying asset of the options sold by vault
        address underlying;
        // Minimum supply of the vault shares issued, for ETH it's 10**10
        uint56 minimumSupply;
        // Vault cap
        uint104 cap;
    }

    VaultParams public vaultParams;
    address public immutable WETH;

    mapping(address => uint256) public deposits;
    mapping(address => uint256) public withdrawals;

    constructor(address _weth) {
        require(_weth != address(0), "!_weth");

        WETH = _weth;
    }

    function initialize(Vault.VaultParams calldata _vaultParams) public {
        vaultParams = _vaultParams;
    }

    function totalBalance() public view returns (uint256) {
        if (vaultParams.asset == WETH) {
            return address(this).balance;
        }
        return uint256(IERC20(vaultParams.asset).balanceOf(address(this)));
    }

    function depositETH() external payable {
        require(msg.value > 0, "!value");
        _depositFor(msg.value, msg.sender);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "!amount");

        _depositFor(amount, msg.sender);

        // An approve() by the msg.sender is required beforehand
        IERC20(vaultParams.asset).safeTransferFrom(msg.sender, address(this), amount);
    }

    function _depositFor(uint256 amount, address creditor) private {
        uint256 totalWithDepositedAmount = IERC20(vaultParams.asset).balanceOf(address(this)) + amount;
        require(totalWithDepositedAmount <= vaultParams.cap, "Exceed cap");
        deposits[creditor] += amount;
    }

    function initiateWithdraw(uint256 numShares) external {
        withdrawals[msg.sender] = numShares;
    }
}
