// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DestinationToken
 * @dev Creates a token that can be minted by the bridge.
 */
contract DestinationToken is ERC20, ERC20Burnable, Ownable {
    address public bridge;

    /**
     * @dev Initializes the contract by setting the bridge address.
     * @param _bridge The bridge address.
     */
    constructor(address _bridge) ERC20("DestinationToken", "D-Token") {
        require(_bridge != address(0), "Bridge address cannot be zero");
        bridge = _bridge;
        console.log("Bridge address set to %s", bridge);
    }

    /**
     * @dev Modifier that only allows the bridge to trigger a function.
     */
    modifier onlyBridge() {
        require(
            bridge == msg.sender,
            "DestinationToken: only the bridge can trigger this method!"
        );
        _;
    }

    /**
     * @dev Updates the bridge address. Can only be called by the owner.
     * @param _bridge The new bridge address.
     */
    function setBridge(address _bridge) public onlyOwner {
        require(_bridge != address(0), "Bridge address cannot be zero");
        bridge = _bridge;
        console.log("Bridge address updated to %s", bridge);
    }

    /**
     * @dev Mints tokens for a given recipient. Can only be called by the bridge.
     * @param _recipient The recipient address.
     * @param _amount The amount of tokens to mint.
     */
    function mint(address _recipient, uint256 _amount)
        public
        virtual
        onlyBridge
    {
        require(_recipient != address(0), "Invalid recipient address");
        require(_amount > 0, "Amount must be greater than zero");
        _mint(_recipient, _amount);
        console.log("Tokens minted for %s, amount: %s", _recipient, _amount);
    }

    /**
     * @dev Burns tokens from a given account. Can only be called by the bridge.
     * @param _account The account from which to burn tokens.
     * @param _amount The amount of tokens to burn.
     */
    function burnFrom(address _account, uint256 _amount)
        public
        virtual
        override(ERC20Burnable)
        onlyBridge
    {
        require(_amount > 0, "Amount must be greater than zero");
        super.burnFrom(_account, _amount);
        console.log("Tokens burned from %s, amount: %s", _account, _amount);
    }
}


