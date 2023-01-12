const {ethers, network} = require("hardhat")

async function main () {
    const raff = await ethers.getContractFactory("Raffle")
    const contract = await raff.deploy();
    
    await contract.deployed();

    console.log(`contrat deployed to ${contract.address}`)
}

main().catch((error => {
    console.error(error);
    process.exitcode = 1
}))