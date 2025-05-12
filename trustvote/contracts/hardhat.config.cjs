require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

const { PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    base_sepolia: {
      accounts: [PRIVATE_KEY],
      url: 'https://sepolia.base.org',
      chainId: 84532
    }
  }
}; 