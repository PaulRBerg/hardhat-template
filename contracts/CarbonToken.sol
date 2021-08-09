// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// import "hardhat/console.sol";

contract CarbonToken is ERC20 {
    constructor() ERC20("CARBON", "CRB") {
        _mint(_msgSender(), 300000000 * (10**uint256(decimals())));
    }

    function faucet(address _account, uint256 _amount) public {
        // console.log("send %s tokens to %s", _amount, _account);
        _mint(_account, _amount);
    }
}
