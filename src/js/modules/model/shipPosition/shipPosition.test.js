import Gameboard from "../gameboard/gameboard";
import Ship from "../ship/ship";
import ShipPosition from "./shipPosition";

describe("shipPosition object", () => {
  const ship = new Ship(2);
  const shipPosition = new ShipPosition();
  const gameboard = new Gameboard();
  let nextPosition;
  gameboard.addShip(3, 4, ship);

  test("tests properties", () => {
    shipPosition.setBoard(gameboard.getGameboard());
    shipPosition.createPotentialPosition(3, 4);

    expect(shipPosition.board.length).toBe(10);
    expect(shipPosition.potentialShipPositions.length).toBe(4);
    expect(shipPosition.potentialShipPositions[0]).toEqual({
      position: [2, 4],
      direction: 0,
    });
    expect(shipPosition.nextPosition).toBeUndefined();
  });

  test("calls getNextPotentialShipPosition() method ", () => {
    nextPosition = shipPosition.getAdjacentHitPositions();

    expect(nextPosition).toBeTruthy();
    expect(shipPosition.nextPosition).toBeDefined();
    expect(shipPosition.nextPosition).toBeTruthy();
    expect(shipPosition.potentialShipPositions.length).toBe(3);
  });

  test("calls clearPotentialPosition() method", () => {
    shipPosition.clearPotentialPosition();

    expect(shipPosition.potentialShipPositions.length).toBe(0);
  });
});
