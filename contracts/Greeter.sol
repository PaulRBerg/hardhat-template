// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import { console } from "hardhat/console.sol";

import { LockupLinear } from "@sablier/v2-core/types/DataTypes.sol";
import { stdError } from "forge-std/StdError.sol";

error GreeterError();

contract Greeter {
    string public greeting;

    constructor(string memory _greeting) {
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

    function throwError() external pure {
        revert GreeterError();
    }
}
