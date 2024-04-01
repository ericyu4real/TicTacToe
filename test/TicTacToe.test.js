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

        // Assuming the player who created the contract automatically becomes player1, so we only need player2 to join the game
        await ticTacToe.connect(player2).joinGame();
    });

    it("Should allow players to make moves", async function () {
        await ticTacToe.connect(player1).makeMove(0, 0);
        await ticTacToe.connect(player2).makeMove(0, 1);
        // Verify the board state, may require additional functions in the contract to view the board state
    });

    it("Should correctly determine a winner", async function () {
        // Simulate a situation where one side wins
        await ticTacToe.connect(player1).makeMove(0, 0);
        await ticTacToe.connect(player2).makeMove(1, 0);
        await ticTacToe.connect(player1).makeMove(0, 1);
        await ticTacToe.connect(player2).makeMove(1, 1);
        await ticTacToe.connect(player1).makeMove(0, 2);
        // Verify winning condition
        expect(await ticTacToe.gameEnded()).to.equal(true);
        // More verification may be needed here, such as who the winner is
    });

    it("Should not allow moves after game end", async function () {
        // First, perform a series of moves according to the winning or drawing conditions
        // For example, simulating player1 winning
        await ticTacToe.connect(player1).makeMove(0, 0);
        await ticTacToe.connect(player2).makeMove(0, 1);
        await ticTacToe.connect(player1).makeMove(1, 0);
        await ticTacToe.connect(player2).makeMove(1, 1);
        await ticTacToe.connect(player1).makeMove(2, 0); // This should trigger the game to end

        // Then, try to make another move after the game has already ended
        await expect(ticTacToe.connect(player2).makeMove(2, 1))
            .to.be.revertedWith("Game has already ended."); // Ensure the error message is consistent with the contract
    });

    it("Should correctly determine a draw", async function () {
        // Simulate a draw situation, here is a possible board layout
        await ticTacToe.connect(player1).makeMove(0, 0);
        await ticTacToe.connect(player2).makeMove(0, 1);
        await ticTacToe.connect(player1).makeMove(0, 2);
        await ticTacToe.connect(player2).makeMove(1, 1);
        await ticTacToe.connect(player1).makeMove(1, 0);
        await ticTacToe.connect(player2).makeMove(1, 2);
        await ticTacToe.connect(player1).makeMove(2, 1);
        await ticTacToe.connect(player2).makeMove(2, 0);
        await ticTacToe.connect(player1).makeMove(2, 2);
        // Verify if the game correctly identifies as a draw
        expect(await ticTacToe.isDraw()).to.equal(true);
        expect(await ticTacToe.gameEnded()).to.equal(true);
    });

    it("Should not allow a move on an occupied cell", async function () {
        // Player1 makes a move at (0, 0)
        await ticTacToe.connect(player1).makeMove(0, 0);
        // Player2 tries to move in the same position
        await expect(ticTacToe.connect(player2).makeMove(0, 0))
            .to.be.revertedWith("This cell is already taken.");
    });

    it("Should not allow more than two players to join the game", async function () {
        // Two players have already joined the game
        // Try to have another player join the game
        const [_, __, thirdPlayer] = await ethers.getSigners();
        await expect(ticTacToe.connect(thirdPlayer).joinGame())
            .to.be.revertedWith("Game already has two players.");
    });

    it("Should reset the game when a player leaves", async function () {
        // Simulate player1 leaving the game
        await ticTacToe.connect(player1).resetGame();
        // Check if the game state has been reset
        expect(await ticTacToe.player1()).to.equal(ethers.constants.AddressZero);
        expect(await ticTacToe.player2()).to.equal(ethers.constants.AddressZero);
        expect(await ticTacToe.gameEnded()).to.equal(false);
        // You may need to check the board state and other related state variables
    });

    it("Should reject moves out of bounds", async function () {
        // Try to make a move at (3, 3), expecting the contract to reject this illegal operation
        await expect(ticTacToe.connect(player1).makeMove(3, 3))
            .to.be.revertedWith("Move is out of bounds."); // Ensure the error message is consistent with the contract
    });

    // Add more test cases to cover various aspects of the game logic
});
