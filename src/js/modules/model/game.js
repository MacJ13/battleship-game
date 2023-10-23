import Computer from "./player/computer";
import User from "./player/user";
import { Queue } from "../queue/queue";

class Game {
  shipQueue = new Queue();
  currentPlayer = new User();
  enemyPlayer = new Computer();
  // userPlaying = false;

  constructor() {
    this.addQueueShips();
  }

  setUserPlayerName(name) {
    this.currentPlayer.setName(name);
  }

  getCurrentPlayerGameboard() {
    return this.currentPlayer.getPlayerBoard();
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getEnemyPlayer() {
    return this.enemyPlayer;
  }

  userPlaying() {
    return this.currentPlayer instanceof User;
  }

  changeCurrentPlayer() {
    const temp = this.currentPlayer;
    this.currentPlayer = this.enemyPlayer;
    this.enemyPlayer = temp;
  }

  getPlayers() {
    return [this.currentPlayer, this.enemyPlayer];
  }

  getGameboardDirection() {
    return this.currentPlayer.getCurrentBoardDirection();
  }

  changeGameboardDirection() {
    this.currentPlayer.changeCurrentBoardDirection();
  }

  getQueueShip() {
    return this.shipQueue.peek();
  }

  dequeShip() {
    this.shipQueue.dequeue();
  }

  addQueueShips() {
    const ships = this.currentPlayer.getShips();
    this.shipQueue.addElements(ships);
  }

  sameLengthShips(current) {
    const peekLength = this.getQueueShip().getLength();

    const condition = peekLength !== current.getLength();

    return condition;
  }

  getCurrentShipLeft() {
    if (!this.userPlaying()) return;
    const cb = this.sameLengthShips.bind(this);
    return this.shipQueue.countElement(cb);
  }
}

export default Game;
