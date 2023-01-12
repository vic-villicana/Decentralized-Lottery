require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-deploy")

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defultNetwork: "hardhat", 
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1
    },
    goerli: {
      chainId:5,
      blockConfirmations: 6,
      url:GOERLI_RPC_URL,
      accounts:[PRIVATE_KEY],
    }
  },
  solidity: "0.8.17",
  namedAccounts: {
    deployer:{
      default:0,
    },
    player: {
      deafult:1,
    }
  }
};
