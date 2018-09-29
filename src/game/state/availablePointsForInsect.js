import { getNeighbors, isSame } from '../utils';
import { setUtilsFactory } from '../setUtils';

const { union, subtract } = setUtilsFactory(isSame);

const flat = array => array.reduce((prev, curr) => prev.concat(curr), []);

const getNextStep = (currentPoint, allInsectsPoints) => {
  // For each neighbor: if exactly one of the two nearest neighbors have an insect, it is possible to move to it
  let neighbors = getNeighbors(currentPoint).map(point => ({ point, isInsect: !!allInsectsPoints.find(isSame(point)) }));
  neighbors = [
    neighbors[5],
    ...neighbors,
    neighbors[0]
  ];
  const points = [];
  for (let i = 1; i <= 6; i++) {
    const count = [-1, 1].filter(delta => neighbors[i + delta].isInsect).length
    if (count === 1) {
      points.push(neighbors[i].point);
    }
  }

  return points;
}

export const availablePointsForInsect = {
  ant: ({ G, currentInsect }) => {
    // Neighbors of (all insects - current insect) - all insects
    const allInsectsPoints = G.insects.map(({ point }) => point);
    const allButSelf = subtract(allInsectsPoints, [currentInsect.point]);
    const neighborsOfAllButSelf = flat(allButSelf.map(getNeighbors));
    return subtract(neighborsOfAllButSelf, allInsectsPoints);
  },
  queen: ({ G, currentInsect }) => {
    const allInsectsPoints = G.insects.map(({ point }) => point);
    return getNextStep(currentInsect.point, allInsectsPoints);
  },
  spider: ({ G, currentInsect }) => {
    // Union neighbors and neighbors of neighbors which are insects recursively three times, each time removing insects and the visited
    const allInsectsPoints = G.insects.map(({ point }) => point);
    let currentPoints = [currentInsect.point];
    let visited = currentPoints;
    for (let i = 0; i < 3; i++) {
      const currentInsectNeighbors = flat(currentPoints.map(getNeighbors));
      const neighboringInsects = union(currentInsectNeighbors, allInsectsPoints);
      const neighborsOfNeighbors = flat(neighboringInsects.map(getNeighbors));
      currentPoints = subtract(union(currentInsectNeighbors, neighborsOfNeighbors), allInsectsPoints, visited);
      visited = [...visited, ...currentPoints];
    }
    return currentPoints;
  }
}
