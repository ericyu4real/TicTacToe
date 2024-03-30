pragma solidity ^0.8.0;

contract TicTacToe {
    address public player1;
    address public player2;
    address public whosTurn;
    bool public gameOver;

    enum Cell { Empty, X, O }
    enum State { Waiting, InProgress, Finished }
    
    Cell[3][3] public board;
    State private gameState;

    modifier playerOnly() {
        require(msg.sender == whosTurn, "Not your turn!");
        _;
    }

    modifier isNotOver() {
        require(!gameOver, "Game is already over!");
        _;
    }

    constructor(address _player1, address _player2) {
        player1 = _player1;
        player2 = _player2;
        whosTurn = player1;
        gameOver = false;
        gameState = State.Waiting;
        initializeBoard();
    }

    function initializeBoard() private {
        for(uint i = 0; i < 3; i++) {
            for(uint j = 0; j < 3; j++) {
                board[i][j] = Cell.Empty;
            }
        }
        gameState = State.InProgress;
    }

    function move(uint x, uint y) public playerOnly isNotOver {
        require(x < 3 && y < 3, "Out of bounds!");
        require(board[x][y] == Cell.Empty, "Illegal Move!");

        Cell cellValue = (whosTurn == player1) ? Cell.X : Cell.O;
        board[x][y] = cellValue;
        if (checkWinner(cellValue)) {
            gameOver = true;
            gameState = State.Finished;
        } else {
            toggleTurn();
        }
    }

    function checkWinner() private view returns (bool) {
    Cell symbol = (whosTurn == player1) ? Cell.X : Cell.O;

    // Check rows and columns
    for (uint i = 0; i < 3; i++) {
        if (board[i][0] == symbol && board[i][1] == symbol && board[i][2] == symbol) {
            return true;
        }
        if (board[0][i] == symbol && board[1][i] == symbol && board[2][i] == symbol) {
            return true;
        }
    }

    // Check diagonals
    if (board[0][0] == symbol && board[1][1] == symbol && board[2][2] == symbol) {
        return true;
    }
    if (board[0][2] == symbol && board[1][1] == symbol && board[2][0] == symbol) {
        return true;
    }

    return false; // No winner found
}


    function toggleTurn() private {
        whosTurn = (whosTurn == player1) ? player2 : player1;
    }

    // Add additional helper functions or events as needed
}
