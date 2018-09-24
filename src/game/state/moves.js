import { createPoint, getNeighbors, isSame } from '../utils';
import { setUtilsFactory } from '../setUtils';

const { union, subtract } = setUtilsFactory(isSame);

const flat = array => array.reduce((prev, curr) => prev.concat(curr), []);

export const moves = {
  selectNew: (G, ctx, currentInsect) => {
    let availablePoints = [];
    if (G.insects.length === 0) { // first insect first player
      availablePoints = [createPoint(0, 0, 0)];
    } else if (G.insects.length === 1) { // first insect second player
      availablePoints = getNeighbors(0, 0, 0);
    } else if (G.insects.length > 1) {
      // neighbors of own insects - neighbors of opponent's insects - insects
      const possiblePoints = flat(G.insects.filter(({ player }) => player === ctx.currentPlayer).map(({ point: { x, y, z } }) => getNeighbors(x, y, z)));
      const excludedPoints = [
        ...flat(G.insects.filter(({ player }) => player !== ctx.currentPlayer).map(({ point: { x, y, z } }) => getNeighbors(x, y, z))),
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
    const type = currentInsect.type;
    let availablePoints = [];
    const allInsectsPoints = G.insects.map(({ point }) => point);
    if (type === 'ant') {
      // Neighbors of (all insects - current insect) - all insects
      const allButSelf = subtract(allInsectsPoints, [currentInsect.point]);
      const neighborsOfAllButSelf = flat(allButSelf.map(({ x, y, z }) => getNeighbors(x, y, z)));
      availablePoints = subtract(neighborsOfAllButSelf, allInsectsPoints);
    } else if (type === 'queen') {
      // Own neighbors union neighbors of neighboring insects - neighboring insects
      const { x, y, z } = currentInsect.point;
      const ownNeighboringPoints = getNeighbors(x, y, z);
      const neighboringInsectPoints = union(ownNeighboringPoints, allInsectsPoints);
      const neighborsOfNeighbors = flat(neighboringInsectPoints.map(({ x, y, z }) => getNeighbors(x, y, z)));
      availablePoints = subtract(union(ownNeighboringPoints, neighborsOfNeighbors), neighboringInsectPoints);
    }
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
