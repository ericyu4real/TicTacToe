const { ethers } = require("ethers");
require("dotenv").config();
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const contractABI = require("../artifacts/contracts/TicTacToe.sol/TicTacToe.json").abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

async function initializePlayer() {
    return new Promise((resolve) => {
        rl.question("Enter your player private key: ", (privateKey) => {
            const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
            const wallet = new ethers.Wallet(privateKey, provider);
            resolve(wallet);
        });
    });
}

let currentPlayerAddress;
let ticTacToeContract;

async function setupContract(wallet) {
    ticTacToeContract = new ethers.Contract(contractAddress, contractABI, wallet);
    currentPlayerAddress = wallet.address;

    // Setup event listeners
    ticTacToeContract.on("PlayerJoined", (player) => {
        console.log(`\nPlayer joined: ${player}`);
    });

    ticTacToeContract.on("MoveMade", async (player, x, y) => {
        console.log(`\nMove made by player: ${player} at (${x},${y})`);
        await displayBoard(); // 重新显示棋盘
    });

    ticTacToeContract.on("GameWon", (winner) => {
        console.log(`\nGame Over. Winner: ${winner}`);
        rl.close();
    });

    ticTacToeContract.on("GameDrawn", () => {
        console.log(`\nGame Over. It's a draw.`);
        rl.close();
    });
}

async function displayBoard() {
    const board = await ticTacToeContract.getBoard();
    console.log("Current board:");
    board.forEach(row => {
        console.log(row.map(cell => cell.toString() === '1' ? '.' : cell.toString() === '2' ? 'X' : 'O').join(' '));
    });
}

async function makeMove(player) {
    rl.question(`Player ${player}, enter your move (row,col): `, async function (move) {
        const [x, y] = move.split(",").map(n => parseInt(n.trim(), 10));
        try {
            const tx = await ticTacToeContract.makeMove(x, y);
            await tx.wait();
            console.log(`Move made at (${x}, ${y}) by Player ${player}`);
        } catch (error) {
            console.error("Error making move:", error.message);
        }
        await displayBoard(); // Display board after move
        // After displaying the board again post-move

        const gameIsOver = await checkGameOver();
        if (gameIsOver) {
            console.log("Game over");
            rl.close();
        } else {
            makeMove(player); // Prompt the next move
        }

    });
}

async function checkGameOver() {
    // Query the smart contract to check if the game has ended
    const gameIsOver = await ticTacToeContract.gameEnded();
    return gameIsOver;
}

async function play() {
    const wallet = await initializePlayer();
    await setupContract(wallet);
    await displayBoard();
    makeMove();
}

play().catch(console.error);

rl.on("close", function () {
    console.log("\nGame ended");
    process.exit(0);
});
