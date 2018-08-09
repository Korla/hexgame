import { Game } from 'boardgame.io/core';
import { gameSize, playerCells, playerColors } from './constants';

const areNeighbors = a => b => (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2 === 1;

const getCoord = (x, y) => `${x}${y}`;

export const getCell = (x, y, cells) => {
  const coord = getCoord(x, y);
  return cells.find(c => c.coord === coord);
}

export const isClickable = (cell) => cell.hasSelectedNeighbor === true && cell.player === undefined;

const updateSelectedNeighbors = G => {
  const cells = G.cells.map(c => {
    const hasSelectedNeighbor = G.cells
      .filter(n => n.player !== undefined)
      .filter(areNeighbors(c))
      .length > 0;
    return {
      ...c,
      hasSelectedNeighbor,
    }
  });

  return {
    ...G,
    cells
  };
}

const handleMove = (condition) => (G, { currentPlayer }, cell) => {
  const cells = G.cells
    .map(c => {
      if (c === cell) {
        return {
          ...c,
          player: currentPlayer,
        }
      }
      if (c.player === undefined) {
        return c;
      }
      const shouldTurn = condition(cell, c);
      const player = shouldTurn === true ? currentPlayer : c.player;
      return {
        ...c,
        player,
      }
    })
  return updateSelectedNeighbors({ ...G, cells });
};

export const game = Game({
  setup: () => {
    const cells = [];
    for (let x = -gameSize; x <= gameSize; x++) {
      for (let y = -gameSize; y <= gameSize; y++) {
        const z = x + y;
        if (z >= -gameSize && z <= gameSize) {
          const coord = getCoord(x, y);
          cells.push({ x, y, z, coord, player: playerCells[coord] });
        }
      }
    }

    return updateSelectedNeighbors({ cells, playerColors });
  },

  moves: {
    claimNeighbors: handleMove((clicked, cell) => areNeighbors(cell)(clicked)),
    attackX: handleMove((clicked, cell) => clicked.x === cell.x),
    attackY: handleMove((clicked, cell) => clicked.y === cell.y),
    attackZ: handleMove((clicked, cell) => clicked.z === cell.z),
  },

  flow: {
    movesPerTurn: 1,
    endGameIf: (G, ctx) => {
      if (G.cells.filter(c => c.player === undefined).length !== 0) {
        return;
      }

      const firstPlayerScore = G.cells.filter(c => c.player === '0').length;

      return {
        winner: firstPlayerScore > G.cells.length ? 0 : 1,
      }
    },
  },
});