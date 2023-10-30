import Computer from "./players/computer";
import User from "./players/user";
import { Queue } from "./queue/queue";

class Game {
  shipQueue = new Queue();
  currentPlayer = new User();
  enemyPlayer = new Computer();
  timer;
  delay;

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

  getCurrentName() {
    return this.currentPlayer.getName();
  }

  getPlayers() {
    return [this.currentPlayer, this.enemyPlayer];
  }

  getGameboardDirection() {
    return this.currentPlayer.getCurrentBoardDirection();
  }

  userPlaying() {
    return this.currentPlayer instanceof User;
  }

  switchPlayers() {
    const temp = this.currentPlayer;
    this.currentPlayer = this.enemyPlayer;
    this.enemyPlayer = temp;
  }

  restartGame() {
    if (!this.userPlaying()) {
      this.switchPlayers();
    }

    for (let player of this.getPlayers()) {
      player.clearPlayerBoard();
      player.resetShips();
    }

    this.addQueueShips();
  }

  changeGameboardDirection() {
    this.currentPlayer.changeCurrentBoardDirection();
  }

  getShipPick() {
    const ship = this.shipQueue.peek();
    const currentShipLeft = this.getCurrentShipLeft();
    const direction = this.getGameboardDirection();

    return { ship, currentShipLeft, direction };
  }

  getQueueShip() {
    return this.shipQueue.peek();
  }

  dequeShip() {
    this.shipQueue.dequeue();
  }

  emptyQueue() {
    return this.shipQueue.isEmpty();
  }

  clearQueueShip() {
    this.shipQueue.clearQueue();
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

  setTimer(cb) {
    this.timer = setTimeout(() => {
      this.timer = null;
      cb();
    }, TIME_OUT);
  }

  getTimer() {
    return this.timer;
  }

  getDelay() {
    return this.delay;
  }

  stopPlaying() {
    return (
      this.enemyPlayer.allSunkenShips() || this.currentPlayer.allSunkenShips()
    );
  }
}

export default Game;
