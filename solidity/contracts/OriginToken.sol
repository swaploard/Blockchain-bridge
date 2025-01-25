// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OriginToken
 * @dev Creates a token that can be minted by the owner.
 */
contract OriginToken is ERC20, Ownable {
    /**
     * @dev Initializes the contract by minting the total supply of tokens to the
     * owner.
     *
     * @param _name The name of the token.
     * @param _symbol The symbol of the token.
     * @param _initialSupply The total supply of tokens to be minted.
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, _initialSupply * (10**uint256(18)));
        console.log("Tokens minted %s", _initialSupply);
        console.log("Deployed! Tokens sent to %s", msg.sender);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        console.log("Minted %s tokens to %s", amount, to);
    }
}

