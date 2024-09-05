let board = [];
let openedSquares = [];
let flaggedSquares = [];
let bombCount = 0;
let squaresLeft = 0;
let currentDifficulty = 'easy';

let bombProbability = 3;
let maxProbability = 15;

const difficulties = {
    easy: { rows: 9, cols: 9, bombs: 10 },
    medium: { rows: 16, cols: 16, bombs: 40 },
    hard: { rows: 16, cols: 30, bombs: 99 }
};

function setDifficulty() {
    currentDifficulty = document.getElementById("difficulty").value;
    resetBoard();
}

function updateBombProbability() {
    bombProbability = document.getElementById("bombProbability").value;
    resetBoard();
}

function updateMaxProbability() {
    maxProbability = document.getElementById("maxProbability").value;
    resetBoard();
}

function resetBoard() {
    const { rows, cols } = difficulties[currentDifficulty];
    generateBoard({ rowCount: rows, colCount: cols });
}

function minesweeperGameBootstrapper(rowCount, colCount) {
    if (rowCount == null && colCount == null) {
        generateBoard(difficulties.easy);
    } else {
        generateBoard({ rowCount, colCount });
    }
}

function generateBoard(boardMetadata) {
    squaresLeft = boardMetadata.rowCount * boardMetadata.colCount;
    board = [];
    openedSquares = [];
    flaggedSquares = [];
    bombCount = 0;

    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    for (let i = 0; i < boardMetadata.rowCount; i++) {
        board[i] = new Array(boardMetadata.colCount);
    }

    for (let i = 0; i < boardMetadata.rowCount; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        for (let j = 0; j < boardMetadata.colCount; j++) {
            const hasBomb = Math.random() * maxProbability < bombProbability;
            if (hasBomb) bombCount++;

            const square = new BoardSquare(hasBomb, 0);
            board[i][j] = square;

            const squareButton = document.createElement('button');
            squareButton.className = 'square';
            squareButton.addEventListener('click', () => openSquare(i, j));
            rowDiv.appendChild(squareButton);
        }
        gameContainer.appendChild(rowDiv);
    }

    for (let i = 0; i < boardMetadata.rowCount; i++) {
        for (let j = 0; j < boardMetadata.colCount; j++) {
            if (board[i][j].hasBomb) {
                incrementSurroundingBombCounts(i, j, boardMetadata.rowCount, boardMetadata.colCount);
            }
        }
    }
    // console.log(board);
}

function incrementSurroundingBombCounts(row, col, rowCount, colCount) {
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < rowCount && j >= 0 && j < colCount && !(i === row && j === col)) {
                board[i][j].bombsAround++;
            }
        }
    }
}

function openSquare(row, col) {
    if (openedSquares.includes(`${row},${col}`) || flaggedSquares.includes(`${row},${col}`)) {
        return;
    }

    const square = board[row][col];
    openedSquares.push(`${row},${col}`);
    squaresLeft--;

    const squareButton = document.querySelectorAll('.row')[row].children[col];

    if (!square.hasBomb) {
        squareButton.innerText = square.bombsAround > 0 ? square.bombsAround : '';
        squareButton.disabled = true;
        squareButton.style.backgroundColor = 'green';
        if (square.bombsAround === 0) {
            openSurroundingSquares(row, col);
        }
        if (squaresLeft === bombCount) {
            endGame(true);
        }
    }else{
        endGame(false);

    }
}

function openSurroundingSquares(row, col) {
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= j + 1; j++) {
            if (i >= 0 && i < board.length && j >= 0 && j < board[0].length && !openedSquares.includes(`${i},${j}`)) {
                openSquare(i, j);
            }
        }
    }
}

function endGame(win) {
    const message = win ? 'You Win!' : 'Game Over!';
    setTimeout(() => alert(message), 1000);
    resetBoard();
}

class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
    }
}

class Pair {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

minesweeperGameBootstrapper(9, 9);
