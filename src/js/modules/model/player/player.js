import { SHIP_SIZES } from "../../../utils/constants";
import Gameboard from "../gameboard/gameboard";
import Ship from "../ship/ship";

class Player {
  gameboard = new Gameboard();
  ships = [];

  constructor() {
    this.addShips();
  }

  addShips() {
    SHIP_SIZES.forEach((size) => {
      let ship = new Ship(size);
      this.ships.push(ship);
    });
  }

  getShips() {
    return this.ships;
  }

  getPlayerBoard() {
    return this.gameboard.getGameboard();
  }

  clearPlayerBoard() {
    this.gameboard.createGameboard();
  }

  addRandomShipsPosition() {
    this.gameboard.addRandomShips(this.ships);
  }
}

export default Player;
