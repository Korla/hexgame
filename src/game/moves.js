import { getCoord, setClickableCells } from './game';

const areNeighbors = a => b => (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2 === 1;

const salmon1 = (level, values) => Math.max(...values, level);
const salmon2 = ({ x, y, z }) => [Math.abs(x), Math.abs(y), Math.abs(z)];

const handleMove = condition => (G, { currentPlayer }, iCoord) => {
  const { x, y, z } = iCoord;
  const newCell = { x, y, z, coord: getCoord({ x, y, z }), player: currentPlayer };
  const cells = [
    ...G.cells.map(c => {
      const shouldTurn = condition(iCoord, c);
      const player = shouldTurn === true ? currentPlayer : c.player;
      return { ...c, player };
    }),
    newCell,
  ];
  const levels = cells
    .map(salmon2)
    .reduce(salmon1, G.levels - 2) + 2;

  return setClickableCells(iCoord)({ ...G, cells, levels });
};

export const moves = {
  claimNeighbors: handleMove((clicked, iCoord) => areNeighbors(iCoord)(clicked)),
  attackX: handleMove((clicked, iCoord) => clicked.x === iCoord.x),
  attackY: handleMove((clicked, iCoord) => clicked.y === iCoord.y),
  attackZ: handleMove((clicked, iCoord) => clicked.z === iCoord.z),
}