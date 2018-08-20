import { AI } from 'boardgame.io/ai';

const moveTypes = [
  'claimNeighbors',
  'attackX',
  'attackY',
  'attackZ',
];

export const ai = AI({
  enumerate: (G, ctx) => {
    const moves = Object.keys(G.clickableCells)
      .map(coord => G.clickableCells[coord])
      .map(iCoord => [iCoord])
      .map(args => moveTypes.map(move => ({ move, args })))
      .reduce((moves, movesPerCell) => moves.concat(movesPerCell), []);
    return moves;
  },
});
