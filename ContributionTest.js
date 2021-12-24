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
        Contract = await ethers.getContractFactory("ContributionTokenReward");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        ContractDeployed = await Contract.deploy();
      });

      describe("Constructor", function () {
          it("balanceOf(address(this)) = 9000000000000000000.", async function () {
            balanceOf = await ContractDeployed.balanceOf(ContractDeployed.address);
            expect((new ethers.BigNumber.from(balanceOf._hex).toString())).to.be.a.bignumber.that.is.equal(new ethers.BigNumber.from('9000000000000000000').toString())
          });
          it("Ethereum_Donated[owner] = 0.", async function () {
            value = await ContractDeployed.DonorAddressCounter(owner.address);
            expect((new ethers.BigNumber.from(value._hex).toString())).to.be.a.bignumber.that.is.equal(new ethers.BigNumber.from('0').toString())
          });
       });

      describe("swapETHforCTR", function () {
        it("Fail tx if msg.value ETH > CRT in contract.", async function () {
                await expect( ContractDeployed.swapETHforCTR({ value: ethers.utils.parseEther( ('10') )  } )   ).to.be.revertedWith('Not enough CRT in contract to match ETH in msg.value!');//'With("");
        });
        it("Fail tx if msg.value == 0", async function () {
                await expect( ContractDeployed.swapETHforCTR()).to.be.revertedWith('For msg.value must be greater than 0!');//'With("");
        });
        it("Mapping after sending 2 then 3 ETH IS 5 ETH: Ethereum_Donated[owner]== 5000000000000000000 WEI", async function () {
              const transaction1 = await ContractDeployed.swapETHforCTR({ value: ethers.utils.parseEther( ('2') )  } )
              const tx_receipt1 = await transaction1.wait()
              const transaction2 = await ContractDeployed.swapETHforCTR({ value: ethers.utils.parseEther( ('3') )  } )
              const tx_receipt2 = await transaction2.wait()
              // const transaction2 = await expect( ContractDeployed.swapETHforCTR({ value: ethers.utils.parseEther( ('3') )  } )   ).to.be.revertedWith('Not enough CRT in contract to match ETH in msg.value!');//'With("");
              // const tx_receipt2 = await transaction2.wait()
              // value = await ContractDeployed.DonorAddressCounter(owner.address);
              // expect((new ethers.BigNumber.from(value._hex).toString())).to.be.a.bignumber.that.is.equal(new ethers.BigNumber.from('0').toString())
              balanceOf = await ContractDeployed.balanceOf(ContractDeployed.address);
              expect((new ethers.BigNumber.from(balanceOf._hex).toString())).to.be.a.bignumber.that.is.equal(new ethers.BigNumber.from('4000000000000000000').toString())
        });
        it("Send correct msg.value and see if event gets state change [ScaleFee_State = 4].", async function () {

                await expect( ContractDeployed.swapETHforCTR({ value: ethers.utils.parseEther( ('0.000000000000000001') )  } )   )
                .to.emit(ContractDeployed, "ContributionEvent")
                .withArgs(owner.address);
        });
      });

});
