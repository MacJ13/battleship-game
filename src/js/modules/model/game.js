import Computer from "./player/computer";
import User from "./player/user";
import { Queue } from "../queue/queue";

class Game {
  shipQueue = new Queue();
  currentPlayer = new User();
  enemyPlayer = new Computer();
  userPlaying = false;

  constructor() {
    this.addQueueShips();
  }

  setUserPlayerName(name) {
    this.currentPlayer.setName(name);
  }

  getPlayers() {
    return [this.currentPlayer, this.enemyPlayer];
  }

  getQueueShip() {
    return this.shipQueue.peek();
  }

  getCountQueueShip() {
    return this.shipQueue.countShipType();
  }

  addQueueShips() {
    const ships = this.currentPlayer.getShips();
    this.shipQueue.addElements(ships);
  }

  sameLengthShips(current) {
    const peekLength = this.shipQueue.peek().getLength();

    const condition = peekLength !== current.getLength();

    return condition;
  }

  getCurrentShipLeft() {
    const cb = this.sameLengthShips.bind(this);
    return this.shipQueue.countElement(cb);
  }
}

export default Game;
