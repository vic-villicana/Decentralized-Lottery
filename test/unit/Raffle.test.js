const {network, ethers, deployments} = require("hardhat")
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers")
const {assert, expect} = require("chai")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25")
const GAS_PRICE_LINK = 1E9



!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", function () {
        let owner,contract, subId, vrfAddress
        const chainId = network.config.chainId
        console.log(chainId)
        before(async () => {
            [owner] = await ethers.getSigners()
            const vrfCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock")
            
            contract = await vrfCoordinatorV2Mock.deploy(BASE_FEE, GAS_PRICE_LINK)
            vrfAddress = contract.address
            const transactionResponse = await contract.createSubscription()
            const transactionReciept = await transactionResponse.wait(1)
            subId = transactionReciept.events[0].args.subId
        })
 

        describe("constructor", function () {
            it("In", async function () {
                const entranceFee = networkConfig[chainId]["entranceFee"]
                const gasLane = networkConfig[chainId]["gasLane"]
                const callBackGasLimit = networkConfig[chainId]["callbackGasLimit"]
                const interval = networkConfig[chainId]["interval"]
                const args = {
                    entranceFee,
                    gasLane,
                    callBackGasLimit,
                    interval,
                    subId,
                    vrfAddress
                }
             
                const raffa = await ethers.getContractFactory("Raffle")
                const raf = await raffa.deploy(vrfAddress, entranceFee, gasLane, subId, callBackGasLimit, interval)
                console.log(raf.address)
                console.log(raf.interface.format(ethers.utils.FormatTypes.json))
            })
        })
  
    })

