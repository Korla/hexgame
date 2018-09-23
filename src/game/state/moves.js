import { createPoint, getNeighbors, areAllConnected } from '../utils';
import { playerColors } from '../constants';

const setColorMap = G => {
  const colorMap = [
    ...G.availablePoints.map(({ coord }) => ({ coord, color: '#ccc' })),
    ...G.insects.map(({ player, point: { coord } }) => ({ coord, color: playerColors[player] })),
    ...(G.currentInsect && G.currentInsect.point ? [{ coord: G.currentInsect.point.coord, color: '#777' }] : []),
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

const setMoveable = G => {
  const insectPoints = G.insects.map(({ point }) => point);
  return {
    ...G,
    insects: G.insects.map(insect => ({
      ...insect,
      isMovable: areAllConnected(insectPoints.filter(i => i !== insect.point)),
    })),
  }
}

// const log = G => {
//   console.log('salmon', JSON.stringify(G.insects.map(({ point }) => point)));
//   return G;
// }

const chain = (...fns) => res => fns.reduce((res, fn) => fn(res), res);

const postProcess = chain(setColorMap, setGridSize, setMoveable);

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
  selectOld: (G, ctx, currentInsect) => {
    const type = currentInsect.type;
    let availablePoints = [];
    if (type === 'ant') {
      // neighbors of (all insects - current insect) - all insects
      const possiblePoints = flat(G.insects
        .filter(i => i !== currentInsect)
        .map(({ point: { x, y, z } }) => getNeighbors(x, y, z)));
      const excludedPoints = G.insects.map(i => i.point);
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
    const insects = [
      ...G.insects.filter(({ id }) => id !== G.currentInsect.id),
      insect,
    ];
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
      currentInsect: null,
      availablePoints: [],
    });
  },
};
