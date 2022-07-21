const {setupUsers, setupUser} = require('./utils');
const { expect } = require("chai");
const { ethers, deployments, getNamedAccounts, getUnnamedAccounts } = require("hardhat");

async function setup () {
    await deployments.fixture(["YourNFT"]);
    const contracts = {
      YourNFT: (await ethers.getContract('YourNFT')),
    };
    const {deployer} = await getNamedAccounts();
    const users = await setupUsers(await getUnnamedAccounts(), contracts);
    return {
      ...contracts,
      users,
      deployer: await setupUser(deployer, contracts),
    };
  }

describe("YourNFT contract", function() {

  describe("Deployment", function () {

    it("Should set the right name and symbol", async function () {
      const {YourNFT} = await setup();
      expect(await YourNFT.name()).to.equal("YourNFT");
      expect(await YourNFT.symbol()).to.equal("YNFT");
    });
  });

  describe("Mint", function () {

    it("Should mint 1 NFT to user", async function () {
      const {YourNFT, deployer } = await setup();
      await YourNFT.mint(deployer.address, 'abc');
      expect(await YourNFT.ownerOf(1)).to.equal(deployer.address);
      expect(await YourNFT.balanceOf(deployer.address)).to.equal(1);
      expect(await YourNFT.tokenURI(1)).to.equal('abc');  
    });

    it("Should not mint beyond max limit", async function () {
      const {YourNFT, deployer } = await setup();
      for(var i = 0; i < 3000; i++){
        await YourNFT.mint(deployer.address, 'abc');
      }
      await expect(YourNFT.mint(deployer.address, 'abc')).to.be.revertedWithCustomError(
        YourNFT,
        "Max_NFT_Limit_Reached"
      );
    });

  });

  describe("Update URI", function () {

    it("Should update uri only by owner of the nft", async function () {
      const {YourNFT, users, deployer } = await setup();
      await YourNFT.mint(deployer.address, 'abc');
      await expect(users[0].YourNFT.updateTokenURI(1, 'def')).to.be.revertedWithCustomError(
        YourNFT,
        "NFT_Not_Owned"
      );
      await deployer.YourNFT.updateTokenURI(1, 'ghi');
      expect(await YourNFT.tokenURI(1)).to.equal('ghi');  
    });
  });

});

