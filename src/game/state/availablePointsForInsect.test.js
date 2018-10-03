import { createPoint } from "../utils";
import { availablePointsForInsect } from "./availablePointsForInsect";

describe('Available points for insect', () => {
  describe('The grasshopper', () => {
    it('Should be able to jump one step over only neighbor', () => {
      // Setup
      const grasshopper = { point: createPoint(0, 0, 0) };
      const onlyNeighbor = { point: createPoint(0, -1, 1) };
      const gameState = { insects: [grasshopper, onlyNeighbor] };
      const expectedPoint = createPoint(0, -2, 2);

      // Test
      const availableMoves = availablePointsForInsect.grasshopper({ G: gameState, currentInsect: grasshopper });

      // Assert
      expect(availableMoves).toHaveLength(1);
      expect(availableMoves[0]).toMatchObject(expectedPoint);
    });

    it('Should be able to jump two steps over only neighbor and its neighbor', () => {
      // Setup
      const grasshopper = { point: createPoint(0, 0, 0) };
      const firstJumpedOver = { point: createPoint(0, -1, 1) };
      const secondJumpedOver = { point: createPoint(0, -2, 2) };
      const gameState = { insects: [grasshopper, firstJumpedOver, secondJumpedOver] };
      const expectedPoint = createPoint(0, -3, 3);

      // Test
      const availableMoves = availablePointsForInsect.grasshopper({ G: gameState, currentInsect: grasshopper });

      // Assert
      expect(availableMoves).toHaveLength(1);
      expect(availableMoves[0]).toMatchObject(expectedPoint);
    })
  })
});
