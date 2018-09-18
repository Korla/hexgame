import { createPoint, getNeighbors } from '../utils';
import { playerColors } from '../constants';

const setColorMap = G => {
  const colorMap = [
    ...G.availablePoints.map(({ coord }) => ({ coord, color: '#ccc' })),
    ...G.insects.map(({ player, point: { coord } }) => ({ coord, color: playerColors[player] })),
  ]
    .reduce((colorMap, { coord, color }) => {
      colorMap[coord] = color;
      return colorMap;
    }, {});
  return {
    ...G,
    grid: {
      ...G.grid,
      colorMap,
    },
  };
};

const setGridSize = G => {
  const levels = G.insects.reduce((levels, { point: { x, y, z } }) => Math.max(levels, x, y, z), G.grid.levels - 2) + 2;
  return {
    ...G,
    grid: {
      ...G.grid,
      levels,
    }
  }
}

const chain = (...fns) => res => fns.reduce((res, fn) => fn(res), res);

const postProcess = chain(setColorMap, setGridSize);

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
    return postProcess({
      ...G,
      currentInsect,
      availablePoints,
    });
  },
  moveInsect: (G, ctx, point) => {
    const insect = {
      ...G.currentInsect,
      point,
      player: ctx.currentPlayer,
    };
    const insects = [...G.insects, insect];
    const players = G.players.map(p => ({
      ...p,
      insects: p.id === ctx.currentPlayer ?
        p.insects.filter(i => i !== G.currentInsect) :
        p.insects,
    }));
    return postProcess({
      ...G,
      currentInsect: null,
      players,
      availablePoints: [],
      insects,
      moveCount: G.moveCount + 1,
    });
  },
  cancel: G => {
    return postProcess({
      ...G,
      availablePoints: [],
      currentInsect: null,
    });
  },
};
