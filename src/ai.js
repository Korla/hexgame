import { AI } from 'boardgame.io/ai';

export const ai = AI({
  enumerate: (G, ctx) => {
    let moves = [];
    for (let i = 0; i < 9; i++) {
      if (G.cells[i] === null) {
        moves.push({ move: 'clickCell', args: [i] });
      }
    }
    return moves;
  },
});
