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

  getShips() {
    return this.ships;
  }

  allShipsSink() {
    return this.ships.every((ship) => ship.getSunk());
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

  resetShips() {
    this.addShips();
  }

  addShips() {
    if (this.ships.length !== 0) this.ships.length = 0;
    SHIP_SIZES.forEach((size) => {
      let ship = new Ship(size);
      this.ships.push(ship);
    });
  }

  addRandomShipsPosition() {
    this.gameboard.addRandomShips(this.ships);
  }

  addShipOnPlayerGameboard(posA, posB, ship) {
    return this.gameboard.addShip(+posA, +posB, ship);
  }

  receiveAttack(posA, posB) {
    return this.gameboard.receiveAttack(posA, posB);
  }

  attackEnemyGameboard(position, enemy) {
    const { posA, posB } = position;
    return enemy.receiveAttack(+posA, +posB);
  }

  addReservedShipPositions(reservedPositions) {
    this.gameboard.addReservedShipPositions(reservedPositions);
  }
}

export default Player;
