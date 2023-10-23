import Game from "../game";

describe("game class", () => {
  const game = new Game();
  test("tests object", () => {
    expect(game.userPlaying()).toBeTruthy();
  });

  test("returns count of type ship", () => {
    expect(game.getCurrentShipLeft()).toBe(2);
  });

  //   test("returns count of type ship after dequeue", () => {
  //     game.
  //     expect(game.getCurrentShipLeft()).toBe(1);

  //   });

  test("change current player", () => {
    game.changeCurrentPlayer();
    expect(game.userPlaying()).toBeFalsy();
  });
});
