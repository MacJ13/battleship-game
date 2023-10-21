import Player from "../player";

describe("player object", () => {
  const player = new Player();
  test(" return properties", () => {
    const board = player.getPlayerBoard();
    const ships = player.getShips();

    // console.log(board, ships);

    expect(board).toBeTruthy();
    expect(ships).toBeTruthy();
    expect(board.length).toBe(10);
    expect(board[0].length).toBe(10);
    expect(ships.length).toBe(8);
    expect(ships[0].getLength()).toBe(4);
  });
});
