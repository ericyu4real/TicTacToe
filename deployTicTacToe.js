// scripts/deployTicTacToe.js

async function main() {
  const [owner, player1, player2] = await hre.ethers.getSigners();

  const TicTacToe = await hre.ethers.getContractFactory("TicTacToe");
  // Deploy the contract and wait for the deployment transaction to be mined
  const ticTacToe = await TicTacToe.deploy(player1.address, player2.address);

  // The contract is now deployed on the network
  console.log("TicTacToe deployed to:", ticTacToe.address);
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

