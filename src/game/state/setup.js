const createInsects = () => [
  {
    type: 'ant',
  },
  {
    type: 'ant',
  },
  {
    type: 'queen',
  },
];

const createPlayer = id => ({
  id,
  insects: createInsects(),
});

export const setup = () => ({
  currentInsect: null,
  players: [
    createPlayer('0'),
    createPlayer('1')
  ],
  grid: {
    levels: 2,
    colorMap: {},
  },
  availablePoints: [],
  insects: [],
  moveCount: 0,
});
