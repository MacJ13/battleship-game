import { SHIP_SIZES } from "../../../utils/constants";
import Gameboard from "../gameboard/gameboard";
import Ship from "../ship/ship";

class Player {
  gameboard = new Gameboard();
  ships = [];
  sunkenShips = 0;

  constructor() {
    this.addShips();
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

  resetShips() {
    this.sunkenShips = 0;
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

  increaseSunkenShips() {
    this.sunkenShips++;
  }

  allSunkenShips() {
    return this.sunkenShips === this.ships.length;
  }
}

export default Player;
