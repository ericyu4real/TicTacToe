const { ethers } = require("ethers");
require("dotenv").config();
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const contractABI = require("../artifacts/contracts/TicTacToe.sol/TicTacToe.json").abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_PLAYER1, provider);
const ticTacToeContract = new ethers.Contract(contractAddress, contractABI, wallet);

async function displayBoard() {
    const board = await ticTacToeContract.getBoard();
    console.log("Current board:");
    board.forEach(row => {
        console.log(row.map(cell => cell === 0 ? '.' : cell === 1 ? 'X' : 'O').join(' '));
    });
}

async function makeMove() {
    await displayBoard();
    rl.question("Enter your move (row,col): ", async function (move) {
        const [x, y] = move.split(",").map(n => parseInt(n.trim(), 10));
        try {
            const tx = await ticTacToeContract.makeMove(x, y);
            await tx.wait();
            console.log(`Move made at (${x}, ${y}) by Player 1`);
        } catch (error) {
            console.error("Error making move:", error.message);
        }
        await displayBoard(); // Display board after move
        makeMove(); // Prompt next move
    });
}

async function play() {
    await makeMove(); // Start game loop
}

play().catch(console.error);

rl.on("close", function () {
    console.log("\nGame ended");
    process.exit(0);
});
