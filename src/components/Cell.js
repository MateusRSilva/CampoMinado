// src/components/Cell.js
import React from 'react';

const Cell = ({ cell, onClick, onRightClick }) => {
  let content = '';
  if (cell.isOpen) {
    content = cell.isMine ? '💣' : cell.adjacentMines || '';
  } else if (cell.isFlagged) {
    content = '🚩';
  }

  return (
    <div
      className={`Cell ${cell.isOpen ? 'open' : ''}`}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
    >
      {content}
    </div>
  );
};

export default Cell;
