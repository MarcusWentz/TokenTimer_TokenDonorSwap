const { expect } = require("chai");
const { ethers } = require("hardhat");
provider = ethers.provider;

var chai = require('chai');
const BN = require('bn.js');
chai.use(require('chai-bn')(BN));

describe("Tests:", function () {

      let Contract;
      let ContractDeployed;
      let owner;
      let addr1;
      let addr2;
      let addrs;

      beforeEach(async function () {
        Contract = await ethers.getContractFactory("TokenTimeTest");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        ContractDeployed = await Contract.deploy();
      });

      describe("Constructor", function () {
          it("balanceOf(address(this)) = 1000000000000000000.", async function () {
            balanceOf = await ContractDeployed.balanceOf(ContractDeployed.address);
            expect((new ethers.BigNumber.from(balanceOf._hex).toString())).to.be.a.bignumber.that.is.equal(new ethers.BigNumber.from('1000000000000000000').toString())
          });
          it("currentBlockTime() > 0.", async function () {
            blockTimestamp = await ContractDeployed.currentBlockTime();
            expect((new ethers.BigNumber.from(blockTimestamp._hex).toString())).to.be.a.bignumber.that.is.greaterThan(new ethers.BigNumber.from('0').toString())
          });
          it("startingBlockTimestamp() > currentBlockTime().", async function () {
            blockTimestamp = await ContractDeployed.currentBlockTime();
            // blockTimestampPlus2 = new ethers.BigNumber.from(blockTimestamp).plus(2);
            startingBlockTimestamp = await ContractDeployed.startingBlockTimestamp();
            expect((new ethers.BigNumber.from(startingBlockTimestamp._hex).toString())).to.be.a.bignumber.that.is.greaterThan(new ethers.BigNumber.from(blockTimestamp).toString())
          });
          it("endingBlockTimestamp() > startingBlockTimestamp().", async function () {
            startingBlockTimestamp = await ContractDeployed.startingBlockTimestamp();
            // blockTimestampPlus60 = new ethers.BigNumber.from(blockTimestamp).plus(60);
            endingBlockTimestamp = await ContractDeployed.endingBlockTimestamp();
            expect((new ethers.BigNumber.from(endingBlockTimestamp._hex).toString())).to.be.a.bignumber.that.is.greaterThan(new ethers.BigNumber.from(startingBlockTimestamp).toString())
          });
       });

      describe("timerTransfer", function () {
        it("Fail tx if msg.value ETH > CRT in contract.", async function () {
                await network.provider.send("evm_increaseTime", [25])
                await network.provider.send("evm_mine")
                await expect( ContractDeployed.timerTransfer()).to.be.revertedWith('Transfer can start after about 30 seconds after deployed!');//'With("");
        });
        it("Fail tx if msg.value == 0", async function () {
              await network.provider.send("evm_increaseTime", [120])
              await network.provider.send("evm_mine")
              // console.log((new ethers.BigNumber.from(blockTimestamp._hex).toString()))
              // await ethers.provider.send("evm_mine", [1640313440+100]);
              // blockTimestamp2 = await ContractDeployed.currentBlockTime();
              // console.log((new ethers.BigNumber.from(blockTimestamp2._hex).toString()))
              // blockTimestamp = await ContractDeployed.currentBlockTime();
              // expect((new ethers.BigNumber.from(startingBlockTimestamp._hex).toString())).to.be.a.bignumber.that.is.greaterThan(new ethers.BigNumber.from(blockTimestamp).toString())
              await expect( ContractDeployed.timerTransfer()).to.be.revertedWith('Transfer time expired [about 120 seconds after deployment]!');//'With("");
        });
        it("Fail tx if all funds transferred already.", async function () {
              await network.provider.send("evm_increaseTime", [35])
              await network.provider.send("evm_mine")
              const transaction1 = await ContractDeployed.timerTransfer()
              const tx_receipt1 = await transaction1.wait()
              await expect( ContractDeployed.timerTransfer()).to.be.revertedWith('All funds have from contract have been moved already!');//'With("");
        });
        it("Emit msg.value for TransferEvent event.", async function () {
                await network.provider.send("evm_increaseTime", [60])
                await network.provider.send("evm_mine")
                await expect( ContractDeployed.timerTransfer())
                .to.emit(ContractDeployed, "TransferEvent")
                .withArgs(owner.address);
        });
      });

});
