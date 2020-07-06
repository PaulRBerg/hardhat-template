/* SPDX-License-Identifier: MIT */
pragma solidity ^0.6.10;

import "@nomiclabs/buidler/console.sol";

contract Greeter {
    string public greeting;

    constructor(string memory _greeting) public {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }
}
