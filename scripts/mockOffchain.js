const { ethers, network} = require("hardhat")

async function  mockKeepers() {
    const raffle = await ethers.getContractAt("Raffle")
}