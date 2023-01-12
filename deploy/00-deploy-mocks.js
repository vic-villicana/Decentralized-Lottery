const {developmentChains} = require("../helper-hardhat-config")
const {ethers} = require("hardhat")
const BASE_FEE = ethers.utils.parseEther("0.25")
const GAS_PRICE_LINK = 1E9
module.exports = async function({getNamedAccounts, deployments}) {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.name.chainId

    if(developmentChains.includes(network.name)){
        log("local network detected! Deploying mocks...")
        //deploy a mock vrf coordinator
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log:true,
            args:[BASE_FEE, GAS_PRICE_LINK]
        })
    }

    log("mocks deployed...")
    log("_____________________________")
}

module.exports.tags  = ["all", "mocks"]