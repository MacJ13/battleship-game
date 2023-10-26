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

  // add every possible direction to check computer array positions
  createPotentialPosition(posA, posB) {
    // loop to check every potential direction available on board
    for (let i = 0; i < this.potentialDirections.length; i++) {
      const [x, y] = this.potentialDirections[i];
      const posX = posA + x;
      const posY = posB + y;
      // check if potential direction exist on board
      if (this.board[posX]?.[posY]) {
        // next we check if board cell is marked
        if (!this.board[posX][posY].marked) {
          // direction defines as index's number of
          // potential Positions
          this.potentialShipPositions.push({
            position: [posX, posY],
            direction: i,
          });
        }
      }
    }
  }

  // clear potential computer positions moves from array
  clearPotentialPosition() {
    this.potentialShipPositions.length = 0;
  }
}

export default ShipPosition;
