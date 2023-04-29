const { network, ethers } = require("hardhat")
const {developmentChains, networkConfig} = require("../helper-hardhat-config")
const FUND_AMOUNT = ethers.utils.parseEther("2")
const {verify} = require("../helper-hardhat-config") 

// const { network, ethers } = require("hardhat")
// const { developmentChains,networkConfig } = require("../helper-hardhat-config")

// module.exports = async function ({getNamedAccounts, deployments}){

//     const {deploy, log} = deployments
//     const {deployer} = await getNamedAccounts()
//     let vrfCoordinatorV2Address
//     if(developmentChains.includes(network.name)) {
//         const vrfCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock")
//         vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
//     }else{
//         vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]

//     }

//     const raffle = await deploy("Raffle", {
//         from: deployer,
//         args: [],
//         log :true,
//         waitConfirmations: network.config.blockConfirmations || 1
//     })
// }


module.exports = async function ({getNamedAccounts, deployments}){


    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId

    const signer = await ethers.getSigner(deployer)
    let vrfCoordinatorV2Address, subscriptionId

    if(developmentChains.includes(network.name)){
        // const vrfCoordinatorV2Mock = await deployments.get("VRFCoordinatorV2Mock")
        const vrfCoordinatorV2Mock = await deployments.get("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        console.log(vrfCoordinatorV2Address)
        let vrfV2Mock = await ethers.getContractAt("VRFCoordinatorV2Mock", vrfCoordinatorV2Address)
        //create a local subscription to get the subscriptionID
        const transactionResponse = await vrfV2Mock.createSubscription()
        const transactionReciept = await transactionResponse.wait(1)
        subscriptionId = transactionReciept.events[0].args.subId
        //find the subscription
        await vrfV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    }else{
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatortV2"]
        //subscription Id
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }   

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]
    let args = [
        vrfCoordinatorV2Address, 
        entranceFee, 
        gasLane, 
        subscriptionId, 
        callbackGasLimit, 
        interval
    ]

    const raffle = await deploy("Raffle", {
        from: deployer,
        args:args,
        log:true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    console.log(raffle.address);

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log("verifying...")
        await verify(raffle.address, args)
    }
    log("_______________________________________")
}

module.exports.tags = ["all", "raffle"]