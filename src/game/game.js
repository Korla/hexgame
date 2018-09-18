import { Game } from 'boardgame.io/core';
import { moves } from './state/moves';
import { setup } from './state/setup';

export const game = Game({
  name: 'the hive',
  setup,
  moves,
  flow: {
    phases: [
      {
        name: 'selectInsect',
        allowedMoves: ['selectNew', 'selectOld'],
        endPhaseIf: G => G.currentInsect !== null,
      },
      {
        name: 'moveInsect',
        allowedMoves: ['moveInsect', 'cancel'],
        endPhaseIf: G => G.currentInsect === null,
      },
    ],
    endTurnIf: (G, ctx) => G.moveCount > ctx.turn,
  },
});