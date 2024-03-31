const { ethers } = require("ethers");
require("dotenv").config();
const contractABI = require("../artifacts/contracts/TicTacToe.sol/TicTacToe.json").abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

// 使用Player2的私钥和提供者
const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_PLAYER2, provider);
const ticTacToeContract = new ethers.Contract(contractAddress, contractABI, wallet);

async function joinGame() {
    const tx = await ticTacToeContract.joinGame();
    console.log('Waiting for transaction to be mined...');
    await tx.wait();
    console.log('Joined game as Player 2');
}

async function makeMove(x, y) {
    const tx = await ticTacToeContract.makeMove(x, y);
    console.log(`Attempting to make move at (${x}, ${y})...`);
    await tx.wait();
    console.log(`Move made at (${x}, ${y}) by Player 2`);
}

// Example usage
async function play() {
    await joinGame();
    // You can add logic to make moves based on the game state here
    // For demonstration, let's make a move directly
    // await makeMove(0, 1);
}

play().catch(console.error);