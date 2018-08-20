import { Game } from 'boardgame.io/core';
import { playerColors } from './constants';
import { moves } from './moves';

export const getCoord = ({ x, y, z }) => `${x},${y},${z}`;

export const getNeighboors = ({ x, y, z }) => [
  [1, -1, 0],
  [1, 0, -1],
  [0, 1, -1],
  [0, -1, 1],
  [-1, 1, 0],
  [-1, 0, 1],
]
  .map(([dx, dy, dz]) => [x + dx, y + dy, z + dz])
  .map(([x, y, z]) => ({ x, y, z, coord: getCoord({ x, y, z }) }));

const isAvailable = G => ({ coord }) => G.cells.find(c => c.coord === coord) === undefined;

const assignClickableCell = (prev, iCoord) => {
  prev[iCoord.coord] = iCoord;
  return prev;
};

export const setClickableCells = iCoord => G => {
  const neighboors = getNeighboors(iCoord);
  const nonSelectedNeighboors = neighboors
    .filter(isAvailable(G));
  const clickableCells = nonSelectedNeighboors.reduce(assignClickableCell, { ...G.clickableCells });
  delete clickableCells[getCoord(iCoord)];

  return { ...G, clickableCells };
}

export const game = Game({
  name: 'hex',
  setup: () => {
    const [x, y, z] = [0, 0, 0];
    const cells = [{ x, y, z, coord: getCoord({ x, y, z }), player: '1' }];
    return setClickableCells(cells[0])({ cells, playerColors, levels: 2, clickableCells: {} });
  },

  moves,

  flow: {
    movesPerTurn: 1,
    endGameIf: (G, ctx) => {
      return ['0', '1']
        .map(player => ({ player, score: G.cells.filter(c => c.player === player).length }))
        .filter(p => p.score >= 30)[0];
    },
  },
});