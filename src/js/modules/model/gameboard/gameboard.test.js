import Ship from "../ship/ship";
import Gameboard from "./gameboard";

describe("gameboard class object", () => {
  const gameboard = new Gameboard();
  test("is defined", () => {
    expect(gameboard).toBeDefined();
  });

  const board = gameboard.getGameboard();
  //   console.log(board);

  test(" returns board property", () => {
    expect(board.length).toEqual(10);
    expect(board).not.toBeNull();
    expect(board).toBeDefined();
  });

  test("returns index from board property", () => {
    const boardElement = board[0];
    console.log(boardElement);
    expect(boardElement).not.toBeNull();
    expect(boardElement[0]).toEqual({
      shipCell: null,
      marked: false,
      reserved: false,
    });
  });

  test("clears board poperty", () => {
    gameboard.clearGameboard();
    expect(board.length).not.toBe(10);
    expect(board.length).toBe(0);
    expect(board[0]).toBeFalsy();
    expect(board).toBeTruthy();
  });

  test("calls getDirection() method ", () => {
    const direction = gameboard.getDirection();

    expect(direction).toBe("horizontal");
  });

  test("changes direction", () => {
    gameboard.changeDirection();

    expect(gameboard.getDirection()).toBe("vertical");
  });

  //   test(" get ")
});

describe("addShip() method", () => {
  const gameboard = new Gameboard();

  //   gameboard.changeDirection();

  test("passes ships to method", () => {
    const ship1 = new Ship(4);
    const ship2 = new Ship(3);
    const result1 = gameboard.addShip(0, 3, ship1);

    gameboard.changeDirection();

    const result2 = gameboard.addShip(5, 2, ship2);

    expect(result1).toBeTruthy();
    expect(result2).toBeTruthy();

    // expect(result).toBeTruthy();
  });

  test("passes wrong positions", () => {
    const ship = new Ship(2);

    expect(gameboard.addShip(-1, 5, ship)).toBeFalsy();
    expect(gameboard.addShip(6, 10, ship)).toBeFalsy();
    expect(gameboard.addShip(11, 2, ship)).toBeFalsy();
    expect(gameboard.addShip(-3, 4, ship)).toBeFalsy();
  });

  test("passes ship to the same positions", () => {
    const ship = new Ship(3);
    const result = gameboard.addShip(0, 3, ship);

    expect(result).toBeFalsy();
  });

  test("passes ship to the reserved positions", () => {
    const ship = new Ship(3);
    const result = gameboard.addShip(0, 2, ship);
    expect(result).toBeFalsy();
  });

  test("tests receiveAttack() method", () => {
    const firstAttack = gameboard.receiveAttack(4, 5);

    expect(firstAttack).toBeDefined();
    expect(firstAttack).toBeTruthy();
    expect(firstAttack.marked).toBeTruthy();
    expect(firstAttack.shipCell).toBeFalsy();
    expect(firstAttack.reserved).toBeFalsy();
  });

  test("tests receiveAttack() method with hit cell", () => {
    const attack = gameboard.receiveAttack(0, 3);

    expect(attack.marked).toBe(true);
    expect(attack).toBeDefined();
    expect(attack.shipCell).toBeDefined();
    expect(attack.shipCell.getHits()).toBe(1);
    expect(attack.shipCell.getSunk()).toBeFalsy();
  });

  test("tests addReservedShipPositions() method", () => {
    const ship = new Ship(3);
    gameboard.changeDirection();

    gameboard.addShip(9, 7, ship);
    gameboard.addReservedShipPositions(ship.getReservedPositions());
    const board = gameboard.getGameboard();

    expect(board[9][6].marked).toBe(true);
    expect(board[8][6].marked).toBe(true);
  });
});
