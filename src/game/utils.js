export const createPoint = (...pos) => {
  const [x, y, z] = pos;
  return { x, y, z, coord: `${x},${y},${z}` };
}

export const isSame = p1 => p2 => p1.coord === p2.coord;

const isInSet = set => point => set.some(isSame(point));

const isNotInSet = set => point => !set.some(isSame(point));

export const union = (...sets) => sets.reduce((union, set) => union.filter(isInSet(set)));

export const subtract = (...sets) => sets.reduce((difference, set) => difference.filter(isNotInSet(set)));

export const getNeighbors = (...pos) => {
  const [x, y, z] = pos;
  return [
    [1, -1, 0],
    [1, 0, -1],
    [0, 1, -1],
    [0, -1, 1],
    [-1, 1, 0],
    [-1, 0, 1],
  ]
    .map(([dx, dy, dz]) => [x + dx, y + dy, z + dz])
    .map(p => createPoint(...p));
}

const areNeighbors = points => {
  const allNeighbors = points.reduce((allNeighbors, { x, y, z }) => [
    ...allNeighbors,
    ...getNeighbors(x, y, z),
  ], []);
  return possible => allNeighbors.some(isSame(possible));
}

const isContained = list => point => !list.some(isSame(point));

export const areAllConnected = points => {
  points = [...points];
  let current = points.splice(0, 1);
  while (points.length > 0 && current.length > 0) {
    current = points.filter(areNeighbors(current));
    points = points.filter(isContained(current));
  }
  return points.length === 0;
}