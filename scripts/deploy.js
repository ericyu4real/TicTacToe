
const hre = require("hardhat");

async function main() {
    const TicTacToe = await hre.ethers.getContractFactory("TicTacToe");
    const ticTacToe = await TicTacToe.deploy();

    await ticTacToe.deployed();

    console.log("TicTacToe deployed to:", ticTacToe.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});