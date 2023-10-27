import Ship from "../../ship/ship";
import Computer from "../computer";
import Player from "../player";

describe("Computer class", () => {
  const computer = new Computer();
  computer.addGameboardPositions();
  test("tests object", () => {
    expect(computer).toBeTruthy();
    expect(computer instanceof Computer).toBeTruthy();
    expect(computer instanceof Player).toBeTruthy();
    expect(computer.getType()).toBeDefined();
    expect(computer.getName()).toBeDefined();
    expect(computer.getName()).toBe("computer");
    expect(computer.getPlayerBoard()).toBeDefined();
  });

  test("tests computer properties", () => {
    expect(computer.availablePositions.length).toBe(100);
    expect(computer.shipHit).toBeFalsy();
  });

  test("tests clearReservedPositions() method in the middle board", () => {
    const ship = new Ship(4);
    computer.addShipOnPlayerGameboard(4, 4, ship);
    computer.clearReservedPositions(ship.getReservedPositions());

    expect(computer.availablePositions.length).toBe(86);
  });

  test("tests clearReservedPositions() method on the verge board", () => {
    const ship = new Ship(3);
    computer.addShipOnPlayerGameboard(0, 7, ship);
    computer.clearReservedPositions(ship.getReservedPositions());

    expect(computer.availablePositions.length).toBe(81);
  });
});
