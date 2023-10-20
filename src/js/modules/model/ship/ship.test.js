import Ship from "./ship";

describe("Ship class object", () => {
  const ship = new Ship(4);
  test(" is not null", () => {
    expect(ship).not.toBeNull();
  });

  test(" is defined", () => {
    expect(ship).toBeDefined();
  });

  test("length field property", () => {
    const shipSize = ship.getLength();

    expect(shipSize).toBe(4);
    expect(shipSize).not.toBe(2);
    expect(shipSize).not.toBeNull();
  });

  test("defines receiveHit()", () => {
    expect(typeof ship.receiveHit).toBe("function");
  });

  test("receiveHit() returns undefined when called", () => {
    expect(ship.receiveHit()).toBeUndefined();
  });
});

describe("Ship hits property", () => {
  const ship = new Ship(2);
  test(" is equal 0", () => {
    const shipHits = ship.getHits();

    expect(shipHits).toBe(0);
    expect(ship.getSunk()).toBeFalsy();
  });

  test(" first time hits", () => {
    ship.receiveHit();

    expect(ship.getHits()).toBe(1);
    expect(ship.getHits()).not.toBe(0);
    expect(ship.getSunk()).toBeFalsy();
  });

  test("last time hits", () => {
    ship.receiveHit();
    expect(ship.getHits()).toBe(2);
    expect(ship.getSunk()).not.toBeFalsy();
    expect(ship.getSunk()).toBeTruthy();
  });
});
