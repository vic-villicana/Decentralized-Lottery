const {ethers, network} = require("hardhat")
const {fs} = require("fs")

const FRONT_END_ADDRESSES_FILE = "../bc-lottery/smartcontract-lottery-frontend/constants/contractAddress.json"
const FRONT_END_ABI_FILE = "../bc-lottery/smartcontract-lottery-frontend/constants/abi.json"
module.exports = async function() {
    if(process.env.UPDATE_FRONT_END){
        console.log("updating front end...")
        updateContractAddresses()
        updateAbi()
    }
}
async function updateAbi(){
    const raffle = await ethers.getContractAt("Raffle")
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    // await deployments.fixture(["Raffle"])
    // const raff = await deployments.get("Raffle")
    const raff = await ethers.getContractAt("Raffle")
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    if(chainId in currentAddresses){
        if(!currentAddresses[chainId].includes(raff.address)){
            currentAddresses[chainId].push(raff.address)
        }
    }{
        currentAddresses[chainId] = [raff.address]
    }

    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "frontend"]