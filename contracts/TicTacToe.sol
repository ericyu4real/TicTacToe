// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicTacToe {
    uint[3][3] public board; // Make the board public for testing and verification
    address public player1;
    address public player2;
    address public currentPlayer;
    bool public gameEnded = false;
    bool public isDraw = false; // Variable for draw state

    event PlayerJoined(address player);
    event MoveMade(address player, uint x, uint y);
    event GameWon(address winner);
    event GameDrawn();
    event GameReset(); // Added for when the game is reset

    constructor() {
        player1 = msg.sender; // Automatically set deployer as player1
        emit PlayerJoined(player1);
    }

    function getBoard() public view returns (uint[3][3] memory) {
        return board;
    }

    function joinGame() public {
        require(player2 == address(0), "Game already has two players.");
        require(msg.sender != player1, "You cannot join the game as player2.");
        player2 = msg.sender; // The first to call joinGame becomes player2
        currentPlayer = player1; // Player1 starts
        emit PlayerJoined(player2);
    }

    function makeMove(uint x, uint y) public {
        require(!gameEnded, "Game has already ended.");
        require(msg.sender == currentPlayer, "It's not your turn.");
        require(x < 3 && y < 3, "Move is out of bounds."); // Ensure the move is within the board
        require(board[x][y] == 0, "This cell is already taken.");
        
        uint playerNumber = (currentPlayer == player1) ? 1 : 2;
        board[x][y] = playerNumber; // Record the move
        emit MoveMade(msg.sender, x, y); // Notify move made

        // Check for win or draw, otherwise switch player
        if (checkWin(playerNumber)) {
            gameEnded = true;
            emit GameWon(currentPlayer);
        } else if (checkDraw()) {
            gameEnded = true;
            isDraw = true; // Mark as draw
            emit GameDrawn();
        } else {
            currentPlayer = (currentPlayer == player1) ? player2 : player1; // Switch turns
        }
    }

    // Check if the current move wins the game
    function checkWin(uint player) private view returns (bool) {
        // Horizontal, Vertical, Diagonal checks
        for (uint i = 0; i < 3; i++) {
            if (board[i][0] == player && board[i][1] == player && board[i][2] == player) {
                return true;
            }
            if (board[0][i] == player && board[1][i] == player && board[2][i] == player) {
                return true;
            }
        }
        // Diagonal checks
        if (board[0][0] == player && board[1][1] == player && board[2][2] == player) {
            return true;
        }
        if (board[0][2] == player && board[1][1] == player && board[2][0] == player) {
            return true;
        }
        return false;
    }

    // Check for a draw
    function checkDraw() private view returns (bool) {
        for (uint i = 0; i < 3; i++) {
            for (uint j = 0; j < 3; j++) {
                if (board[i][j] == 0) {
                    return false; // If any cell is unoccupied, it's not a draw
                }
            }
        }
        return true; // All cells are occupied, it's a draw
    }

    // Reset the game to initial state
    function resetGame() public {
        // Clear the board
        for (uint i = 0; i < 3; i++) {
            for (uint j = 0; j < 3; j++) {
                board[i][j] = 0;
            }
        }

        // Reset players and game state
        player1 = address(0);
        player2 = address(0);
        currentPlayer = address(0);
        gameEnded = false;
        isDraw = false;

        // Notify the game has been reset
        // emit GameReset(); // Uncommented to use
    }

    // Allow a player to leave the game, triggering a game reset
    function jumpLeave() public{
        // Check if the caller is one of the players
        if(msg.sender == player1){
            player1 = address(0);
        } else {
            player2 = address(0);
        }
        gameEnded = true; // End the game

        emit GameWon(currentPlayer); // Consider changing this logic if the game is not actually won

        resetGame(); // Reset the game after a player leaves
    }
}
