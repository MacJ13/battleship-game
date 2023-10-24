class Gameboard {
  static maxSize = 10;
  board = [];

  directions = ["horizontal", "vertical"];

  constructor() {
    this.createGameboard();
  }

  getGameboard() {
    return this.board;
  }

  getDirection() {
    return this.directions[0];
  }

  changeDirection() {
    const [first, second] = this.directions;
    this.directions = [second, first];
  }

  clearGameboard() {
    this.board.length = 0;
  }

  createGameboard() {
    this.clearGameboard();
    for (let i = 0; i < Gameboard.maxSize; i++) {
      this.board[i] = [];
    }

    for (let i = 0; i < Gameboard.maxSize; i++) {
      for (let j = 0; j < Gameboard.maxSize; j++) {
        this.board[i][j] = { shipCell: null, marked: false, reserved: false };
      }
    }
  }

  addShip(posA, posB, ship) {
    ship.clearReservedPositions();

    if (
      posA < 0 ||
      posA >= Gameboard.maxSize ||
      posB < 0 ||
      posB >= Gameboard.maxSize
    )
      return;

    // check if boardcell is has ship or reserved place
    if (this.board[posA][posB].shipCell || this.board[posA][posB].reserved)
      return;

    const direction = this.getDirection();
    const shipLength = ship.getLength();

    if (direction === "horizontal") {
      // check if we can ship lenght can be put in current cell;
      if (shipLength + posB > Gameboard.maxSize) return;
      //check if other cells for ship is empty or reserved
      for (let i = 1; i < shipLength; i++) {
        const { shipCell, reserved } = this.board[posA][posB + i];
        if (shipCell || reserved) return;
      }
      // fill board position with ship elements
      for (let i = 0; i < shipLength; i++) {
        this.board[posA][posB + i].shipCell = ship;
      }

      // fill board with reserved cells around ship elements
      for (let i = -1; i <= 1; i++) {
        // console.log(this.board[posA + i]);
        if (!this.board[posA + i]) continue;
        for (let j = -1; j <= shipLength; j++) {
          // console.log(this.board[posA + i]);
          if (
            posB + j < 0 ||
            posB + j >= Gameboard.maxSize ||
            this.board[posA + i][posB + j].shipCell
          )
            continue;

          this.board[posA + i][posB + j].reserved = true;
          ship.addReservedPositions({ posA: posA + i, posB: posB + j });
        }
      }
    } else if (direction === "vertical") {
      if (shipLength + posA > Gameboard.maxSize) return;

      // check if cell is empty or reserved for ship length
      for (let i = 0; i < shipLength; i++) {
        const { shipCell, reserved } = this.board[posA + i][posB];

        if (shipCell || reserved) return;
      }
      // fill board position with ship elements
      for (let i = 0; i < shipLength; i++) {
        this.board[posA + i][posB].shipCell = ship;
      }

      // fill board with reserved cells around ship elements
      for (let i = -1; i <= shipLength; i++) {
        if (!this.board[posA + i]) continue;

        for (let j = -1; j <= 1; j++) {
          if (
            posB + j < 0 ||
            posB + j >= Gameboard.maxSize ||
            this.board[posA + i][posB + j].shipCell
          )
            continue;
          this.board[posA + i][posB + j].reserved = true;
          ship.addReservedPositions({ posA: posA + i, posB: posB + j });
        }
      }
    }

    return ship;
  }

  addRandomShips(ships) {
    this.createGameboard();

    while (ships.length > 0) {
      let posA = Math.floor(Math.random() * Gameboard.maxSize);
      let posB = Math.floor(Math.random() * Gameboard.maxSize);

      let direction = Math.floor(Math.random() * this.directions.length);

      /// ??????
      //// NIE WIEM CZY DZIAŁA
      //////
      if (direction) {
        this.changeDirection();
      }

      const [first, ...others] = ships;
      const result = this.addShip(posA, posB, first);
      if (result) ships = others;
    }

    return this.board;
  }

  receiveAttack(posA, posB) {
    const { marked, shipCell } = this.board[posA][posB];

    //check if element is marked
    if (marked) return;

    // set marked property to true;
    this.board[posA][posB].marked = true;

    if (shipCell) shipCell.receiveHit();

    // return object from board
    return this.board[posA][posB];
  }
}

export default Gameboard;
