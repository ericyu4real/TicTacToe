const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicTacToeFactory", function () {
    let TicTacToe;
    let TicTacToeFactory;
    let ticTacToeFactory;
    let player1;

    beforeEach(async function () {
        [player1] = await ethers.getSigners();
        TicTacToe = await ethers.getContractFactory("TicTacToe");
        TicTacToeFactory = await ethers.getContractFactory("TicTacToeFactory");
        ticTacToeFactory = await TicTacToeFactory.deploy();
    });

    it("Should create a new TicTacToe game", async function () {
        await ticTacToeFactory.createGame();
        const games = await ticTacToeFactory.getGames();
        expect(games.length).to.equal(1);
    });
});
