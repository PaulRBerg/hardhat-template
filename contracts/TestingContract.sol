// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestingContract is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        address _beneficiary
    ) ERC20(_name, _symbol) {
        _mint(_beneficiary, _totalSupply);
    }

    function mint222222(address _account, uint256 _amount) public {
        _mint(_account, _amount);
    }
}
