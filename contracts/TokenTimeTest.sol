// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenTimeTest is ERC20{

    uint public startingBlockTimestamp;
    uint public endingBlockTimestamp;
    address public TokenTimeTestAddress = address(this);
    TokenTimeTest tokenObject = TokenTimeTest(TokenTimeTestAddress);

    event TransferEvent(
        address indexed from
    );

    constructor() ERC20("TokenTimeTest","TTT") {
        _mint(address(this), 1*(10**18) );
        startingBlockTimestamp =  block.timestamp + 30; //Open to transfer after 30 seconds [15 seconds for block.timestamp helps protect against MEV].
        endingBlockTimestamp = block.timestamp + 120; //Transfer option ends after 120 seconds
    }

    function currentBlockTime() public view returns (uint) {
        return block.timestamp;
    }

    function timerTransfer() public {
        require(block.timestamp > startingBlockTimestamp , "Transfer can start after about 30 seconds after deployed!");
        require(block.timestamp < endingBlockTimestamp , "Transfer time expired [about 120 seconds after deployment]!");
        require(tokenObject.balanceOf(address(this))  > 0, "All funds have from contract have been moved already!");
        tokenObject.transfer(msg.sender, 1*(10**18) );
        emit TransferEvent(msg.sender);
    }

}
