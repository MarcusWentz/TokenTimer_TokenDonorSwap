// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol';

contract TokenTimeTest is ERC20{

    uint public startingBlockTimestamp;
    uint public endingBlockTimestamp;
    address public TokenTimeTestAddress = address(this);    
    TokenTimeTest tokenObject = TokenTimeTest(TokenTimeTestAddress);

    event TransferEvent(
        uint indexed date,
        address indexed from
    );

    constructor() ERC20("TokenTimeTest","TTT") {
        _mint(address(this), 1*(10**18) );
        startingBlockTimestamp =  block.timestamp + 15; //Open to transfer after 15 seconds [safe after at least 15 seconds from MEV]
        endingBlockTimestamp = block.timestamp + 60; //Transfer option ends after 60 seconds
    }

    function currentBlockTime() public view returns (uint) {
        return block.timestamp;
    }

    function timerTransfer() public {
        require(block.timestamp > startingBlockTimestamp , "Epoch time must be 2 over seconds after contract deployed!");
        require(block.timestamp < endingBlockTimestamp , "Transfer time expired [60 seconds].");
        require(tokenObject.balanceOf(address(this))  > 0, "All funds have from contract have been moved already!");
        tokenObject.transfer(msg.sender, 1*(10**18) ); 
        emit TransferEvent(block.timestamp, msg.sender);
    }
    
}
