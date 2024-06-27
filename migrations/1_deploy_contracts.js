// SPDX-License-Identifier: MIT
const GreenEnergyToken = artifacts.require("GreenEnergyToken");
const GreenEnergyCrowdsale = artifacts.require("GreenEnergyCrowdsale");
const GreenEnergyProjectVoting = artifacts.require("GreenEnergyProjectVoting");

module.exports = async function (deployer, network, accounts) {
  // Deploy GreenEnergyToken with initial supply
  const initialSupply = web3.utils.toBN(1000000).mul(web3.utils.toBN(10).pow(web3.utils.toBN(18))); // 1 million tokens
  await deployer.deploy(GreenEnergyToken, initialSupply);

  deployer.link(GreenEnergyToken, GreenEnergyCrowdsale);
  
  // Deploy GreenEnergyCrowdsale
  const tokenInstance = await GreenEnergyToken.deployed();
  const rate = 100; // Example rate
  const wallet = accounts[3];
  await deployer.deploy(GreenEnergyCrowdsale, rate, wallet, tokenInstance.address);
  
  deployer.link(GreenEnergyToken, GreenEnergyProjectVoting);

  // Deploy GreenEnergyProjectVoting
  await deployer.deploy(GreenEnergyProjectVoting, tokenInstance.address);
};
