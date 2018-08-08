import { Game } from 'boardgame.io/core';
import { gameSize } from './constants';

// Return true if `cells` is in a winning configuration.
function IsVictory(cells) {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let pos of positions) {
    const symbol = cells[pos[0]];
    let winner = symbol;
    for (let i of pos) {
      if (cells[i] !== symbol) {
        winner = null;
        break;
      }
    }
    if (winner != null) return true;
  }

  return false;
}

// Return true if all `cells` are occupied.
function IsDraw(cells) {
  return cells.filter(c => c === null).length === 0;
}

export const game = Game({
  setup: () => {
    const playerColors = [
      '#7a1',
      '#17a'
    ]
    const playerCells = {
      '00': 0,
    }
    const cells = [];
    for (let x = -gameSize; x <= gameSize; x++) {
      for (let y = -gameSize; y <= gameSize; y++) {
        const z = x + y;
        if (z >= -gameSize && z <= gameSize) {
          const coord = `${x}${y}`;
          cells.push({ x, y, coord, player: playerCells[coord] });
        }
      }
    }
    console.log(cells);
    return {
      cells,
      playerColors
    }
  },

  moves: {
    clickCell: (G, ctx, id) => {
      const cells = [...G.cells];

      if (cells[id] === null) {
        cells[id] = ctx.currentPlayer;
      }

      return { ...G, cells };
    },
  },

  flow: {
    movesPerTurn: 1,
    endGameIf: (G, ctx) => {
      if (IsVictory(G.cells)) {
        return { winner: ctx.currentPlayer };
      }
      if (IsDraw(G.cells)) {
        return { draw: true };
      }
    },
  },
});