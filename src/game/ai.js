import { AI } from 'boardgame.io/ai';
import { isClickable } from './game';

const moveTypes = [
  'claimNeighbors',
  'attackX',
  'attackY',
  'attackZ',
];

export const ai = AI({
  enumerate: (G, ctx) => {
    const moves = G.cells
      .filter(isClickable)
      .map(cell => [cell])
      .map(args => moveTypes.map(move => ({ move, args })))
      .reduce((moves, movesPerCell) => moves.concat(movesPerCell), []);
    return moves;
  },
});
