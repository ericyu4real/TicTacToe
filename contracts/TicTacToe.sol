// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicTacToe {
    uint[3][3] public board; // 将棋盘设为public以便测试和验证
    address public player1;
    address public player2;
    address public currentPlayer;
    bool public gameEnded;
    bool public isDraw; // 平局状态变量

    event PlayerJoined(address player);
    event MoveMade(address player, uint x, uint y);
    event GameWon(address winner);
    event GameDrawn();

    constructor() {
        player1 = msg.sender;
        emit PlayerJoined(player1);
    }

    function getBoard() public view returns (uint[3][3] memory) {
        return board;
    }

    function joinGame() public {
        require(player2 == address(0), "Game already has two players.");
        require(msg.sender != player1, "You cannot join the game as player2.");
        player2 = msg.sender;
        currentPlayer = player1;
        emit PlayerJoined(player2);
    }

    function makeMove(uint x, uint y) public {
        require(!gameEnded, "Game has already ended.");
        require(msg.sender == currentPlayer, "It's not your turn.");
        require(board[x][y] == 0, "This cell is already taken.");
        
        uint playerNumber = (currentPlayer == player1) ? 1 : 2;
        board[x][y] = playerNumber;
        emit MoveMade(msg.sender, x, y);

        if (checkWin(playerNumber)) {
            gameEnded = true;
            emit GameWon(currentPlayer);
        } else if (checkDraw()) {
            gameEnded = true;
            isDraw = true;
            emit GameDrawn();
        } else {
            currentPlayer = (currentPlayer == player1) ? player2 : player1;
        }
    }

    function checkWin(uint player) private view returns (bool) {
        for (uint i = 0; i < 3; i++) {
            if (board[i][0] == player && board[i][1] == player && board[i][2] == player) {
                return true;
            }
            if (board[0][i] == player && board[1][i] == player && board[2][i] == player) {
                return true;
            }
        }
        if (board[0][0] == player && board[1][1] == player && board[2][2] == player) {
            return true;
        }
        if (board[0][2] == player && board[1][1] == player && board[2][0] == player) {
            return true;
        }
        return false;
    }

    function checkDraw() private view returns (bool) {
        for (uint i = 0; i < 3; i++) {
            for (uint j = 0; j < 3; j++) {
                if (board[i][j] == 0) {
                    return false;
                }
            }
        }
        return true;
    }
}
