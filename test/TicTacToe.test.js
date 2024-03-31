const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicTacToe Gameplay", function () {
    let TicTacToe;
    let ticTacToe;
    let player1;
    let player2;

    beforeEach(async function () {
        [player1, player2] = await ethers.getSigners();
        TicTacToe = await ethers.getContractFactory("TicTacToe");
        ticTacToe = await TicTacToe.deploy();
        await ticTacToe.deployed();

        // 假定创建合约的玩家自动成为player1，因此只需要让player2加入游戏
        await ticTacToe.connect(player2).joinGame();
    });

    it("Should allow players to make moves", async function () {
        await ticTacToe.connect(player1).makeMove(0, 0);
        await ticTacToe.connect(player2).makeMove(0, 1);
        // 验证棋盘状态，可能需要合约提供额外的函数来查看棋盘状态
    });

    it("Should correctly determine a winner", async function () {
        // 模拟一方获胜的情况
        await ticTacToe.connect(player1).makeMove(0, 0);
        await ticTacToe.connect(player2).makeMove(1, 0);
        await ticTacToe.connect(player1).makeMove(0, 1);
        await ticTacToe.connect(player2).makeMove(1, 1);
        await ticTacToe.connect(player1).makeMove(0, 2);
        // 验证获胜条件
        expect(await ticTacToe.gameEnded()).to.equal(true);
        // 这里可能还需要更多验证，比如获胜者是谁
    });

    it("Should not allow moves after game end", async function () {
        // 首先，按照游戏胜利或平局的条件执行一系列移动
        // 例如，模拟玩家1获胜的情况
        await ticTacToe.connect(player1).makeMove(0, 0);
        await ticTacToe.connect(player2).makeMove(0, 1);
        await ticTacToe.connect(player1).makeMove(1, 0);
        await ticTacToe.connect(player2).makeMove(1, 1);
        await ticTacToe.connect(player1).makeMove(2, 0); // 这应该触发游戏结束

        // 然后，尝试在游戏已经结束后执行另一个移动
        await expect(ticTacToe.connect(player2).makeMove(2, 1))
            .to.be.revertedWith("Game has already ended."); // 确保这里的错误信息与合约中的一致
    });


    // 添加更多测试用例以覆盖游戏逻辑的各个方面
});
