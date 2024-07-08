import React, { useState, useEffect, useCallback } from 'react';
import Cell from './Cell';
import Timer from './Timer';
import DifficultySelector from './DifficultySelector';

const createBoard = (rows, cols, mines) => {
  let board = Array(rows)
    .fill()
    .map(() =>
      Array(cols).fill({
        isOpen: false,
        isMine: false,
        isFlagged: false,
        adjacentMines: 0,
      })
    );

  // Adicionar minas aleatoriamente
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    let row = Math.floor(Math.random() * rows);
    let col = Math.floor(Math.random() * cols);
    if (!board[row][col].isMine) {
      board[row][col] = { ...board[row][col], isMine: true };
      minesPlaced++;
    }
  }

  // Calcular minas adjacentes
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col].isMine) {
        let adjacentMines = 0;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (
              row + x >= 0 &&
              row + x < rows &&
              col + y >= 0 &&
              col + y < cols
            ) {
              if (board[row + x][col + y].isMine) {
                adjacentMines++;
              }
            }
          }
        }
        board[row][col] = { ...board[row][col], adjacentMines };
      }
    }
  }

  return board;
};

const Board = () => {
  const [board, setBoard] = useState(createBoard(8, 8, 10));
  const [startTime, setStartTime] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [loss, setLoss] = useState(false);

  const revealAdjacentCells = useCallback((board, row, col) => {
    const rows = board.length;
    const cols = board[0].length;
    const stack = [[row, col]];

    while (stack.length > 0) {
      const [currentRow, currentCol] = stack.pop();
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          const newRow = currentRow + x;
          const newCol = currentCol + y;
          if (
            newRow >= 0 &&
            newRow < rows &&
            newCol >= 0 &&
            newCol < cols &&
            !board[newRow][newCol].isOpen &&
            !board[newRow][newCol].isFlagged
          ) {
            board[newRow][newCol] = { ...board[newRow][newCol], isOpen: true };
            if (
              board[newRow][newCol].adjacentMines === 0 &&
              !board[newRow][newCol].isMine
            ) {
              stack.push([newRow, newCol]);
            }
          }
        }
      }
    }
  }, []);

  const handleCellClick = (row, col) => {
    if (!startTime) setStartTime(true);

    if (board[row][col].isMine) {
      setLoss(true);
      setStartTime(false);
      setGameOver(true);
    } else {
      const newBoard = [...board];
      newBoard[row][col] = { ...newBoard[row][col], isOpen: true };
      if (newBoard[row][col].adjacentMines === 0) {
        revealAdjacentCells(newBoard, row, col);
      }
      setBoard(newBoard);
    }
  };

  const handleRightClick = (row, col) => {
    const newBoard = [...board];
    newBoard[row][col] = {
      ...newBoard[row][col],
      isFlagged: !newBoard[row][col].isFlagged,
    };
    setBoard(newBoard);
  };

  const checkForWin = useCallback(() => {
    let mineCount = 0;
    let flaggedCount = 0;
    let correctFlags = 0;
    let openCells = 0;

    board.forEach(row => {
      row.forEach(cell => {
        if (cell.isMine) mineCount++;
        if (cell.isFlagged) flaggedCount++;
        if (cell.isFlagged && cell.isMine) correctFlags++;
        if (cell.isOpen) openCells++;
      });
    });

    if (
      correctFlags === mineCount &&
      flaggedCount === mineCount &&
      openCells === board.length * board[0].length - mineCount
    ) {
      setStartTime(false);
      setWin(true);
      setGameOver(true);
    }
  }, [board]);

  useEffect(() => {
    if (!gameOver) {
      checkForWin();
    }
  }, [board, gameOver, checkForWin]);

  const handleDifficultyChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case 'easy':
        setBoard(createBoard(8, 8, 10));
        break;
      case 'medium':
        setBoard(createBoard(10, 10, 40));
        break;
      case 'hard':
        setBoard(createBoard(15, 15, 99));
        break;
      default:
        setBoard(createBoard(8, 8, 10));
    }
    setStartTime(false);
    setGameOver(false);
    setWin(false);
    setLoss(false);
  };

  const resetGame = useCallback(() => {
    setBoard(createBoard(8, 8, 10));
    setStartTime(false);
    setGameOver(false);
    setWin(false);
    setLoss(false);
  }, []);

  return (
    <div className="container">
      <h1>Campo Minado</h1>
      <div className="userview">
        <DifficultySelector onChange={handleDifficultyChange} />
        <Timer start={startTime} stop={gameOver} />
      </div>
      <div className="Board">
        {win && <div className="message">Congratulations! You won!
          <button onClick={resetGame}>Restart</button>
        </div>}
        {loss && (
          <div className="message">
            Game Over! You hit a mine.{' '}
            <button onClick={resetGame}>Restart</button>
          </div>
        )}
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="Board-row">
            {row.map((cell, colIndex) => (
              <Cell
                key={colIndex}
                cell={cell}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onRightClick={() => handleRightClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
