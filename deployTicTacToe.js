// scripts/deployTicTacToe.js

const hre = require("hardhat");

async function main() {
  const TicTacToe = await hre.ethers.getContractFactory("TicTacToe");
  const ticTacToe = await TicTacToe.deploy();

  await ticTacToe.deployed();

  console.log("TicTacToe deployed to:", ticTacToe.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
