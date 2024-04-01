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

// save current player address
const currentPlayerAddress = wallet.address;

// monitor PlayerJoined event
ticTacToeContract.on("PlayerJoined", (player) => {
    if (player.toLowerCase() !== currentPlayerAddress.toLowerCase()) {
        console.log(`\nPlayer joined: ${player}`);
    }
});

// monitor MoveMade event
ticTacToeContract.on("MoveMade", async (player, x, y) => {
    if (player.toLowerCase() !== currentPlayerAddress.toLowerCase()) {
        console.log(`\nMove made by opponent at (${x},${y})`);
        await displayBoard(); 
        console.log(`\nPlayer ${currentPlayer}, enter your move (row,col): `);
    }
});

ticTacToeContract.on("GameReset", () => {
    console.log("The game has been reset. Please start a new game.");
    process.exit(); 
});

// monitor GameWon event
ticTacToeContract.on("GameWon", (winner) => {
    console.log(`\nGame Over. Winner: ${winner}`);
    process.exit(); 
});

// monitor GameDrawn event
ticTacToeContract.on("GameDrawn", () => {
    console.log(`\nGame Over. It's a draw.`);
    process.exit(); 
});

function parse_err(errmsg) {
    const errorPattern = /revert ([^"]+)/;
    const match = errmsg.match(errorPattern);

    if (match) {
        console.warn("Revert:", match[1].slice(0, -1));
        // console.log("Extracted Error Message:", match[1]);
    } else {
        console.warn(errmsg);
    }
}

let currentPlayer = 1; // Player 1 starts the game

async function displayBoard() {
    const board = await ticTacToeContract.getBoard();
    console.log("Current board:");
    board.forEach(row => {
        console.log(row.map(cell => cell.toString() === '1' ? 'X' : cell.toString() === '2' ? 'O' : '.').join(' '));
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
            // console.error("Error making move:", error.message);
            parse_err(error.message);
        }
        await displayBoard(); // Display board after move

    const gameIsOver = await checkGameOver();
    if (gameIsOver) {
        // await ticTacToeContract.leaveGame(); // Leave the game
        console.log("Game over");
        // rl.close();
    } else {
        // console.log("Player 2's turn")
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
    await displayBoard();
    await makeMove(currentPlayer); // Start game loop
}

play().catch(console.error);


rl.on("close", async function () {
    console.log("\nGame ended");
    try {
        const tx = await ticTacToeContract.jumpLeave();
        await tx.wait(); // wait for the transaction to be mined
        console.log("Successfully left the game.");
    } catch (error) {
        console.error("Failed to leave the game:", error);
    }

    process.exit(0);
});

process.on('SIGINT', () => {
    rl.close();
});