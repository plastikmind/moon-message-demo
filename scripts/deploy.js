const hre = require("hardhat");

async function main() {
    const MoonMessage = await hre.ethers.getContractFactory("MoonMessage");
    const moonMessage = await MoonMessage.deploy();
    await moonMessage.deployed();
    console.log("MoonMessage deployed to ", moonMessage.address);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });