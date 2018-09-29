const isInSetFactory = comparator => set => element => set.some(comparator(element));

const isNotInSetFactory = comparator => set => element => !set.some(comparator(element));

const unionFactory = comparator => {
  const isInSet = isInSetFactory(comparator);
  return (...sets) => sets.reduce((union, set) => union.filter(isInSet(set)));
};

const subtractFactory = comparator => {
  const isNotInSet = isNotInSetFactory(comparator);
  return (...sets) => sets.reduce((difference, set) => difference.filter(isNotInSet(set)));
};

const uniqueFactory = comparator => set => set.filter((item, i) => set.findIndex(comparator(item)) === i);

export const setUtilsFactory = comparator => ({
  union: unionFactory(comparator),
  subtract: subtractFactory(comparator),
  unique: uniqueFactory(comparator),
});
