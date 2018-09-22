let insectId = 0;
const createInsect = type => ({
  type,
  id: insectId++,
})
const createInsects = () => [
  createInsect('ant'),
  createInsect('ant'),
  createInsect('queen'),
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
