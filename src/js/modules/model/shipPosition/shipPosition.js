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

  getNextPotentialShipPosition() {
    // 1. First we get random number for index of array potentialComputerPositions
    const randomNumber = Math.floor(
      Math.random() * this.potentialShipPositions.length
    );

    // eventually if element is not in array we return exist nextPosition
    if (!this.potentialShipPositions[randomNumber]) {
      this.clearPotentialPosition();
      return this.nextPosition;
    }

    // 2. next we get position and direction from element of
    // potentialShipPositions array
    const { position, direction } = this.potentialShipPositions[randomNumber];

    // 3. next we assign two positions to variables
    const x = position[0];
    const y = position[1];

    // 4. we assign nextPosition with position x and position y
    // and we extract ship cell, marked, property from board element
    this.nextPosition = { posA: x, posB: y };
    const { shipCell, marked } = this.board[x][y];

    // 5a. condition to check if there is not ship cell
    // we removing element from potentialShipPositions
    if (!shipCell) {
      this.potentialShipPositions.splice(randomNumber, 1);
    }
    // 5b. otherwise is there shipCell and marked is falsy
    // we remove and
    else if (shipCell && !marked) {
      // 5c. remove element from potentialShipPosition array
      this.potentialShipPositions.splice(randomNumber, 1);

      const correctDirection = direction % 2 === 0;

      // filter elements only with correct direction
      // depending on position ship on board
      const filterPositions = this.potentialShipPositions.filter((position) => {
        const { direction } = position;
        const result = correctDirection
          ? this.isEven(direction)
          : this.isOdd(direction);

        return result;
      });

      this.potentialShipPositions = filterPositions;

      // 5c. we set to check next position in the same direction
      // like our element
      const [dirX, dirY] = this.potentialDirections[direction];

      const nextX = dirX + x;
      const nextY = dirY + y;

      // check if there is element for next position
      if (this.board[nextX]?.[nextY]) {
        // check if element on board is not marked and has ship object
        if (
          !this.board[nextX][nextY].marked &&
          this.board[nextX][nextY].shipCell
        ) {
          // we add next possible position to
          // potential computer position array
          this.potentialShipPositions.push({
            position: [nextX, nextY],
            direction,
          });
        }
      }
    }
    // return nextPosition to check on user board

    return this.nextPosition;
  }

  getAdjacentHitPositions(position) {
    if (this.potentialShipPositions.length === 0) {
      const { posA, posB } = position;
      this.createPotentialPosition(posA, posB);
    }

    return this.getNextPotentialShipPosition();
  }

  // clear potential computer positions moves from array
  clearPotentialPosition() {
    this.potentialShipPositions.length = 0;
  }
}

export default ShipPosition;
