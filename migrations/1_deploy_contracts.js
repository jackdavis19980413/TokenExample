// SPDX-License-Identifier: MIT
const GreenEnergyToken = artifacts.require("GreenEnergyToken");
const GreenEnergyCrowdsale = artifacts.require("GreenEnergyCrowdsale");
const GreenEnergyProjectVoting = artifacts.require("GreenEnergyProjectVoting");

module.exports = async function (deployer, network, accounts) {
  // Deploy GreenEnergyToken with initial supply
  const initialSupply = web3.utils.toBN(1000000).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18))); // 1 million tokens
  await deployer.deploy(GreenEnergyToken, initialSupply);
  const tokenInstance = await GreenEnergyToken.deployed();



  const rate = 2500; // Example rate
  const wallet = accounts[0];



  await deployer.deploy(GreenEnergyProjectVoting, tokenInstance.address);
  const votingInstance = await GreenEnergyProjectVoting.deployed();

  

  await deployer.deploy(GreenEnergyCrowdsale, rate, tokenInstance.address, votingInstance.address);
  const crowdsaleInstance = await GreenEnergyCrowdsale.deployed();

  await votingInstance.transferOwnership(crowdsaleInstance.address);
  await tokenInstance.transferOwnership(crowdsaleInstance.address);
  await crowdsaleInstance.transferOwnership(wallet);
};
