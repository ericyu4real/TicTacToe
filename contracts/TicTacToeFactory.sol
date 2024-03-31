// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TicTacToe.sol"; // 确保正确导入了你的TicTacToe合约

contract TicTacToeFactory {
    TicTacToe[] public games;

    event GameCreated(address gameAddress, address creator);

    function createGame() public {
        TicTacToe newGame = new TicTacToe();
        games.push(newGame);
        emit GameCreated(address(newGame), msg.sender);
    }

    function getGames() public view returns (TicTacToe[] memory) {
        return games;
    }
}
