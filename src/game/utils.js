export const createPoint = (...pos) => {
  const [x, y, z] = pos;
  return { x, y, z, coord: `${x},${y},${z}` };
}

export const isSame = p1 => p2 => p1.coord === p2.coord;

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

const areNeighbors = (p1, { point: { x, y, z } }) => {
  const neighbors = getNeighbors(x, y, z);
  return neighbors.some(p => p.coords = p1.coords);
}