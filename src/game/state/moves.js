import { createPoint, getNeighbors, areAllConnected, isSame } from '../utils';
import { playerColors } from '../constants';
import { setUtilsFactory } from '../setUtils';

const { union, subtract } = setUtilsFactory(isSame);

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

const setMoveableAndClickable = G => {
  const insectPoints = G.insects.map(({ point }) => point);
  const playersHavePlacedQueen = G.insects.reduce((playersHavePlacedQueen, { player, type }) => {
    playersHavePlacedQueen[player] = playersHavePlacedQueen[player] || type === 'queen';
    return playersHavePlacedQueen;
  }, [0, 0]);
  return {
    ...G,
    insects: G.insects.map(insect => ({
      ...insect,
      isMovable: playersHavePlacedQueen[insect.player] && areAllConnected(insectPoints.filter(i => i !== insect.point)),
    })),
    players: G.players.map(player => ({
      ...player,
      insects: player.insects.map(insect => ({
        ...insect,
        isClickable: playersHavePlacedQueen[insect.player] || player.moveCount !== 3 || insect.type === 'queen',
      })),
    })),
  }
}

// const log = G => {
//   console.log('salmon', JSON.stringify(G.insects.map(({ point }) => point)));
//   return G;
// }

const chain = (...fns) => res => fns.reduce((res, fn) => fn(res), res);

const postProcess = chain(setColorMap, setGridSize, setMoveableAndClickable);

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
      insects: p.insects.filter(({ id }) => id !== G.currentInsect.id),
      moveCount: p.id === ctx.currentPlayer ? p.moveCount + 1 : p.moveCount,
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
