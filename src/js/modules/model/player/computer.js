import { binarySearch } from "../../../utils/helpers";
import ShipPosition from "../shipPosition/shipPosition";
import Player from "./player";

class Computer extends Player {
  availablePositions = [];
  shipHit;

  position;
  potentialShipPositions = new ShipPosition();

  constructor(type = "computer") {
    super(type);
    this.shipHit = false;
  }

  getName() {
    return "computer";
  }

  selectShipHitting() {
    this.shipHit = true;
  }

  deselectShipHitting() {
    this.shipHit = false;
  }

  // method add all possible board positions
  // to availablePositions array
  addGameboardPositions() {
    if (this.availablePositions.length !== 0)
      this.availablePositions.length = 0;
    const board = this.getPlayerBoard();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        this.availablePositions.push({ posA: i, posB: j });
      }
    }
  }

  // method returns potential board ship position for computer
  getEnemyPositionBoard(board) {
    // if  ship was hit, get only positions
    // around that ship hit position
    if (this.shipHit) {
      // get position around position of hit ship
      this.potentialShipPositions.setBoard(board);
      const nextPosition = this.potentialShipPositions.getAdjacentHitPositions(
        this.position
      );
      this.position = nextPosition; // assign this  position to property

      // search correct index of availablePositions array
      const index = binarySearch(this.availablePositions, this.position);
      // next remove the position from availabePosition array
      if (index !== -1) this.availablePositions.splice(index, 1);
      else {
        this.position = this.availablePositions.pop();

        this.potentialShipPositions.clearPotentialPosition();
      }

      // otherwise randomly get potential board ship
      // position from availablePosition array
    } else {
      const randomNumber = Math.floor(
        Math.random() * this.availablePositions.length
      );

      // assign to element of randomnumber index
      this.position = this.availablePositions[randomNumber];

      // next remove the position from availabePosition array
      this.availablePositions.splice(randomNumber, 1);
    }

    return this.position;
  }

  clearPotentialShipPositions() {
    this.potentialShipPositions.clearPotentialPosition();
  }

  clearReservedPositions(reservedPositions) {
    reservedPositions.forEach((position) => {
      const index = binarySearch(this.availablePositions, position);
      if (index >= 0) this.availablePositions.splice(index, 1);
    });
  }
}

export default Computer;
