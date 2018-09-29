import { createPoint, getNeighbors } from '../utils';
import { availablePointsForInsect } from './availablePointsForInsect';

const flat = array => array.reduce((prev, curr) => prev.concat(curr), []);

export const moves = {
  selectNew: (G, ctx, currentInsect) => {
    let availablePoints = [];
    if (G.insects.length === 0) { // first insect first player
      availablePoints = [createPoint(0, 0, 0)];
    } else if (G.insects.length === 1) { // first insect second player
      availablePoints = getNeighbors({ x: 0, y: 0, z: 0 });
    } else if (G.insects.length > 1) {
      // neighbors of own insects - neighbors of opponent's insects - insects
      const possiblePoints = flat(G.insects.filter(({ player }) => player === ctx.currentPlayer).map(({ point }) => getNeighbors(point)));
      const excludedPoints = [
        ...flat(G.insects.filter(({ player }) => player !== ctx.currentPlayer).map(({ point }) => getNeighbors(point))),
        ...G.insects.map(i => i.point),
      ]
      availablePoints = possiblePoints.filter(possible => excludedPoints.every(excluded => excluded.coord !== possible.coord));
    }
    return {
      ...G,
      currentInsect,
      availablePoints,
    };
  },
  selectOld: (G, ctx, currentInsect) => {
    const availablePoints = availablePointsForInsect[currentInsect.type]({ G, currentInsect });
    return {
      ...G,
      currentInsect,
      availablePoints,
    };
  },
  moveInsect: (G, ctx, point) => {
    const insect = {
      ...G.currentInsect,
      point,
      player: ctx.currentPlayer,
    };
    const insects = [
      ...G.insects.filter(({ id }) => id !== G.currentInsect.id),
      insect,
    ];
    const players = G.players.map(p => ({
      ...p,
      insects: p.insects.filter(({ id }) => id !== G.currentInsect.id),
      moveCount: p.id === ctx.currentPlayer ? p.moveCount + 1 : p.moveCount,
    }));
    return {
      ...G,
      currentInsect: null,
      players,
      availablePoints: [],
      insects,
      moveCount: G.moveCount + 1,
    };
  },
  cancel: G => {
    return {
      ...G,
      currentInsect: null,
      availablePoints: [],
    };
  },
};
