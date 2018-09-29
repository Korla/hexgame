import { getNeighbors, isSame } from '../utils';
import { setUtilsFactory } from '../setUtils';

const { union, subtract } = setUtilsFactory(isSame);

const flat = array => array.reduce((prev, curr) => prev.concat(curr), []);

export const availablePointsForInsect = {
  ant: ({ G, currentInsect }) => {
    // Neighbors of (all insects - current insect) - all insects
    const allInsectsPoints = G.insects.map(({ point }) => point);
    const allButSelf = subtract(allInsectsPoints, [currentInsect.point]);
    const neighborsOfAllButSelf = flat(allButSelf.map(({ x, y, z }) => getNeighbors(x, y, z)));
    return subtract(neighborsOfAllButSelf, allInsectsPoints);
  },
  queen: ({ G, currentInsect }) => {
    // Own neighbors union neighbors of neighboring insects - neighboring insects
    const allInsectsPoints = G.insects.map(({ point }) => point);
    const { x, y, z } = currentInsect.point;
    const ownNeighboringPoints = getNeighbors(x, y, z);
    const neighboringInsectPoints = union(ownNeighboringPoints, allInsectsPoints);
    const neighborsOfNeighbors = flat(neighboringInsectPoints.map(({ x, y, z }) => getNeighbors(x, y, z)));
    return subtract(union(ownNeighboringPoints, neighborsOfNeighbors), neighboringInsectPoints);
  },
  spider: ({ G, currentInsect }) => {
    // Union neighbors and neighbors of neighbors which are insects recursively three times, each time removing insects and the visited
    const allInsectsPoints = G.insects.map(({ point }) => point);
    let currentPoints = [currentInsect.point];
    let visited = currentPoints;
    for (let i = 0; i < 3; i++) {
      const currentInsectNeighbors = flat(currentPoints.map(({ x, y, z }) => getNeighbors(x, y, z)));
      const neighboringInsects = union(currentInsectNeighbors, allInsectsPoints);
      const neighborsOfNeighbors = flat(neighboringInsects.map(({ x, y, z }) => getNeighbors(x, y, z)));
      currentPoints = subtract(union(currentInsectNeighbors, neighborsOfNeighbors), allInsectsPoints, visited);
      visited = [...visited, ...currentPoints];
    }
    return currentPoints;
  }
}
