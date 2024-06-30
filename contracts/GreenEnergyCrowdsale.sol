// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GreenEnergyToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GreenEnergyCrowdsale is Ownable {
    GreenEnergyToken public token;
    uint256 public rate; // Tokens per Ether
    uint256 public weiRaised;

    event TokensPurchased(address indexed purchaser, uint256 value, uint256 amount);
    event TransferResult(bool success);

    constructor(uint256 _rate, address _wallet, GreenEnergyToken _token) Ownable(msg.sender) {
        require(_rate > 0, "Rate should be greater than 0");
        require(_wallet != address(0), "Wallet address should not be zero");
        require(address(_token) != address(0), "Token address should not be zero");

        rate = _rate;
        token = _token;
        transferOwnership(_wallet);
    }

    function buyTokens() public payable {
        uint256 weiAmount = msg.value;
        require(weiAmount > 0, "You need to send some ether");

        uint256 tokens = _getTokenAmount(weiAmount);
        weiRaised += weiAmount;
        token.mint(msg.sender, tokens);
        
        emit TokensPurchased(msg.sender, weiAmount, tokens);
        emit TransferResult(true);

        payable(owner()).transfer(weiAmount);
    }

    function getRate() public view returns(uint256) {
        return rate;
    }

    function getTokenAmount(uint256 weiAmount) public view returns(uint256) {
        return _getTokenAmount(weiAmount) / 1 ether;
    }

    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        return weiAmount * rate;
    }

    function setRate(uint256 newRate) public onlyOwner {
        rate = newRate;
    }

    function withdrawTokens(uint256 amount) public onlyOwner {
        token.transfer(owner(), amount);
    }
}
