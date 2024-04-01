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

// 监听PlayerJoined事件
ticTacToeContract.on("PlayerJoined", (player) => {
    console.log(`\nPlayer joined: ${player}`);
});

// 监听MoveMade事件
ticTacToeContract.on("MoveMade", async (player, x, y) => {
    console.log(`\nMove made by player: ${player} at (${x},${y})`);
    await displayBoard(); // 重新显示棋盘
});


async function displayBoard() {
    const board = await ticTacToeContract.getBoard();
    console.log("Current board:");
    board.forEach(row => {
        console.log(row.map(cell => cell.toString() === '1' ? '.' : cell.toString() === '2' ? 'X' : 'O').join(' '));
    });
}

async function makeMove() {
    await displayBoard();
    rl.question("Enter your move (row,col): ", async function (move) {
        const [x, y] = move.split(",").map(n => parseInt(n.trim(), 10));
        try {
            const tx = await ticTacToeContract.makeMove(x, y);
            await tx.wait();
            console.log(`Move made at (${x}, ${y}) by Player 2`);
        } catch (error) {
            // 找到JSON字符串的开始位置
            const jsonStartIndex = error.message.indexOf('{');
            // 如果找到了有效的JSON开始位置
            if (jsonStartIndex > -1) {
                // 截取从JSON开始位置到字符串末尾的部分
                const jsonString = error.message.substring(jsonStartIndex);
                try {
                    // 尝试解析JSON字符串
                    const errorObj = JSON.parse(jsonString);
                    // 尝试从解析后的对象中提取错误信息
                    const revertMessage = errorObj.error?.data?.stack || errorObj.error?.message || "Unknown error";
                    console.error("Error making move:", revertMessage);
                } catch (parseError) {
                    // 如果解析JSON失败，则打印原始错误信息
                    console.error("Error making move:", error.message);
                }
            } else {
                // 如果没有找到有效的JSON开始位置，则打印原始错误信息
                console.error("Error making move:", error.message);
            }
        }
        await displayBoard(); // Display board after move
        makeMove(); // Prompt next move
    });
}

async function play() {
    await ticTacToeContract.joinGame(); // Join the game
    await makeMove(); // Start game loop
}

play().catch(console.error);

rl.on("close", function () {
    console.log("\nGame ended");
    process.exit(0);
});
