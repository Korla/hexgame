import { getNeighbors, isSame, isNotSame, getPointByVector, createPoint } from '../utils';
import { setUtilsFactory } from '../setUtils';

const { unique, subtract } = setUtilsFactory(isSame);

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
    if (neighbors[i].isInsect === false) {
      const count = [-1, 1].filter(delta => neighbors[i + delta].isInsect).length
      if (count === 1) {
        points.push(neighbors[i].point);
      }
    }
  }

  return points;
}

export const availablePointsForInsect = {
  ant: ({ G, currentInsect }) => {
    const allInsectsPoints = G.insects
      .map(({ point }) => point)
      .filter(isNotSame(currentInsect.point));
    let currentPoints = [currentInsect.point];
    let visited = [];
    let points = [];
    while (currentPoints.length) {
      visited = [...visited, ...currentPoints];
      const newPoints = unique(flat(currentPoints.map(point => getNextStep(point, allInsectsPoints))));
      currentPoints = subtract(newPoints, visited);
      points = [
        ...points,
        ...currentPoints,
      ];
    }
    return points;
  },
  queen: ({ G, currentInsect }) => {
    const allInsectsPoints = G.insects.map(({ point }) => point);
    return getNextStep(currentInsect.point, allInsectsPoints);
  },
  spider: ({ G, currentInsect }) => {
    const allInsectsPoints = G.insects
      .map(({ point }) => point)
      .filter(isNotSame(currentInsect.point));
    let currentPoints = [currentInsect.point];
    let visited = [];
    for (let i = 0; i < 3; i++) {
      visited = [...visited, ...currentPoints];
      const newPoints = flat(currentPoints.map(point => getNextStep(point, allInsectsPoints)));
      currentPoints = subtract(newPoints, visited);
    }
    return currentPoints;
  },
  grasshopper: ({ G, currentInsect }) => {
    const insectsPoints = G.insects.map(({ point }) => point);
    const isOccupiedByInsect = p => insectsPoints.some(isSame(p));
    const getJumpVector = dest => src => createPoint(src.x - dest.x, src.y - dest.y, src.z - dest.z);

    const log = suffix => data => { console.log(suffix, data); return data; }
    return getNeighbors(currentInsect.point)
      .map(log('getNeighbors'))
      .filter(isOccupiedByInsect)
      .map(log('isOccupiedByInsect'))
      .map(getJumpVector(currentInsect.point))
      .map(log('getJumpVector'))
      .map(vector => {
        let jumpTarget = getPointByVector(currentInsect.point, vector);
        while (insectsPoints.some(isSame(jumpTarget))) {
          jumpTarget = getPointByVector(jumpTarget, vector);
        }
        return jumpTarget;
      })
      .map(log('result'));
  }
};


