import { areAllConnected } from './utils';

[
  ['no elements', true, []],
  ['one element', true, [
    { 'x': 0, 'y': 0, 'z': 0, 'coord': '0,0,0' }
  ]],
  ['elements in a line', true, [
    { 'x': 0, 'y': 0, 'z': 0, 'coord': '0,0,0' },
    { 'x': -1, 'y': 0, 'z': 1, 'coord': '-1,0,1' },
    { 'x': 1, 'y': 0, 'z': -1, 'coord': '1,0,-1' }
  ]],
  ['line missing middle', false, [
    { 'x': -1, 'y': 0, 'z': 1, 'coord': '-1,0,1' },
    { 'x': 1, 'y': 0, 'z': -1, 'coord': '1,0,-1' }
  ]],
].forEach(([name, expected, args]) => it(`areAllConnected, ${name}, returns ${expected}`, () => expect(areAllConnected(args)).toEqual(expected)));


