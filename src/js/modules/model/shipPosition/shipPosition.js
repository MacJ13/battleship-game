class ShipPosition {
  board = [];
  // properties to choose potential positons
  // when ship is hit
  potentialShipPositions = [];
  nextPosition;
  potentialDirections = [
    [-1, 0], // up next position
    [0, 1], // right next position
    [1, 0], // bottom next position
    [0, -1], // left next position
  ];

  setBoard(board) {
    this.board = board;
  }

  isEven(direction) {
    return direction % 2 === 0;
  }

  isOdd(direction) {
    return direction % 2 === 1;
  }

  // clear potential computer positions moves from array
  clearPotentialPosition() {
    this.potentialShipPositions.length = 0;
  }
}

export default ShipPosition;
