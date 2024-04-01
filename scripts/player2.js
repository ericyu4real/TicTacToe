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
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_PLAYER2, provider);
const ticTacToeContract = new ethers.Contract(contractAddress, contractABI, wallet);

let currentPlayer = 2; // Player 1 starts the game

// 保存当前玩家的地址
const currentPlayerAddress = wallet.address;

// 监听PlayerJoined事件
ticTacToeContract.on("PlayerJoined", (player) => {
    if (player.toLowerCase() !== currentPlayerAddress.toLowerCase()) {
        console.log(`\nPlayer joined: ${player}`);
    }
});

// 监听MoveMade事件
ticTacToeContract.on("MoveMade", async (player, x, y) => {
    if (player.toLowerCase() !== currentPlayerAddress.toLowerCase()) {
        console.log(`\nMove made by opponent at (${x},${y})`);
        await displayBoard(); // 重新显示棋盘
        console.log(`\nPlayer ${currentPlayer}, enter your move (row,col): `);
    }
});

ticTacToeContract.on("GameReset", () => {
    console.log("Your Opponent Left. The game has been reset. Please start a new game.");
    process.exit(); 
});

// 监听GameWon事件
ticTacToeContract.on("GameWon", (winner) => {
    console.log(`\nGame Over. Winner: ${winner}`);
    process.exit(); 
});

// 监听GameDrawn事件
ticTacToeContract.on("GameDrawn", () => {
    console.log(`\nGame Over. It's a draw.`);
    process.exit(); 
});


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

        const gameIsOver = await checkGameOver();
        if (gameIsOver) {
            await ticTacToeContract.leaveGame(); // Leave the game
            console.log("Game over");
            rl.close();
        } else {
            console.log("Player 1's turn")
            makeMove(currentPlayer); // Prompt the next move
        }

    });
}

async function checkGameOver() {
    // Query the smart contract to check if the game has ended
    const gameIsOver = await ticTacToeContract.gameEnded();
    return gameIsOver;
}

async function play() {
    await ticTacToeContract.joinGame(); // Join the game
    await displayBoard(); // Display the board
    await makeMove(currentPlayer); // Start game loop
}

play().catch(console.error);

rl.on("close", function () {
    console.log("\nGame ended");
    ticTacToeContract.resetGame(); // 离开游戏
    process.exit(0);
});

process.on('SIGINT', () => {
    rl.close();
});