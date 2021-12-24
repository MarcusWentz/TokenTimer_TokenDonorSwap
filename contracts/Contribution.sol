// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ContributionTokenReward is ERC20{

    uint public startingBlockTimestamp;
    uint public endingBlockTimestamp;
    address public ContributionTokenRewardAddress = address(this);
    ContributionTokenReward tokenObject = ContributionTokenReward(ContributionTokenRewardAddress);

    event ContributionEvent(
        address indexed from
    );

    constructor() ERC20("ContributionTokenReward","CTR") {
        _mint(address(this), 9*(10**18) );
    }

    mapping(address => uint) public Ethereum_Donated;

    function swapETHforCTR() public payable {
        require(tokenObject.balanceOf(address(this))  >= msg.value, "Not enough CRT in contract to match ETH in msg.value!");
        require(msg.value > 0, "For msg.value must be greater than 0!");
        tokenObject.transfer(msg.sender, msg.value); //Reward for sending ETH. 1:1 swap pair between ETH and CTR.
        Ethereum_Donated[msg.sender] += msg.value;
        emit ContributionEvent(msg.sender);
    }

    function DonorAddressCounter(address DonorAddress) public view returns (uint) {
        return Ethereum_Donated[DonorAddress];
    }

}
