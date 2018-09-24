import { areAllConnected, isSame, getNeighbors } from '../utils';
import { playerColors } from '../constants';
import { setUtilsFactory } from '../setUtils';

const { subtract } = setUtilsFactory(isSame);

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

const handleGameover = G => {
  const insectPoints = G.insects.map(({ point }) => point);
  const losers = G.insects
    .filter(({ type }) => type === 'queen')
    .map(({ point, player }) => ({ ...point, player }))
    .map(({ x, y, z, player }) => ({ player, neighbors: getNeighbors(x, y, z) }))
    .filter(({ neighbors }) => subtract(neighbors, insectPoints).length === 0)
    .map(({ player }) => player);
  const gameover = losers.length > 0 ? {
    losers,
  } : null;
  return {
    ...G,
    gameover,
  }
}

// const log = G => {
//   console.log('salmon', JSON.stringify(G.insects.map(({ point }) => point)));
//   return G;
// }

const chain = (...fns) => res => fns.reduce((res, fn) => fn(res), res);

export const postProcess = chain(setColorMap, setGridSize, setMoveableAndClickable, handleGameover);
