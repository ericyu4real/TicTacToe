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
        require(msg.sender == whosTurn, "Not your turn");
        _;
    }

    modifier isNotOver() {
        require(!gameOver, "Game is already over");
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
        require(x < 3 && y < 3, "Out of bounds");
        require(board[x][y] == Cell.Empty, "Cell is already filled");

        Cell cellValue = (whosTurn == player1) ? Cell.X : Cell.O;
        board[x][y] = cellValue;
        if (checkWinner(cellValue)) {
            gameOver = true;
            gameState = State.Finished;
            // Emit a game over event here
        } else {
            toggleTurn();
        }
    }

    function checkWinner(Cell cellValue) private view returns (bool) {
        // Add logic to check if a player has won the game
    }

    function toggleTurn() private {
        whosTurn = (whosTurn == player1) ? player2 : player1;
    }

    // Add additional helper functions or events as needed
}
