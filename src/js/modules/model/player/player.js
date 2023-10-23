import { SHIP_SIZES } from "../../../utils/constants";
import Gameboard from "../gameboard/gameboard";
import Ship from "../ship/ship";

class Player {
  type;
  gameboard = new Gameboard();
  ships = [];

  constructor(type) {
    this.type = type;
    this.addShips();
  }

  getType() {
    return this.type;
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

  getCurrentBoardDirection() {
    return this.gameboard.getDirection();
  }

  changeCurrentBoardDirection() {
    this.gameboard.changeDirection();
  }

  clearPlayerBoard() {
    this.gameboard.createGameboard();
  }

  addRandomShipsPosition() {
    this.gameboard.addRandomShips(this.ships);
  }

  addShipOnPlayerGameboard(posA, posB, ship) {
    return this.gameboard.addShip(+posA, +posB, ship);
  }
}

export default Player;
