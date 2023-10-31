/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/sass/main.scss":
/*!****************************!*\
  !*** ./src/sass/main.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/js/modules/controller.js":
/*!**************************************!*\
  !*** ./src/js/modules/controller.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/helpers */ "./src/js/utils/helpers.js");
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model */ "./src/js/modules/model/index.js");
/* harmony import */ var _view_gameplayView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view/gameplayView */ "./src/js/modules/view/gameplayView.js");
/* harmony import */ var _view_menuView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view/menuView */ "./src/js/modules/view/menuView.js");
/* harmony import */ var _view_modalView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./view/modalView */ "./src/js/modules/view/modalView.js");






const menuView = new _view_menuView__WEBPACK_IMPORTED_MODULE_3__["default"]();
const gameplayView = new _view_gameplayView__WEBPACK_IMPORTED_MODULE_2__["default"]();
const modalView = new _view_modalView__WEBPACK_IMPORTED_MODULE_4__["default"]();
const game = new _model__WEBPACK_IMPORTED_MODULE_1__["default"]();

const resetGameboard = () => {
  const user = game.getCurrentPlayer();

  user.clearPlayerBoard();
  game.addQueueShips();
  gameplayView.hidePlayButton();
  gameplayView.renderGameboardRandom(user.getPlayerBoard());
  gameplayView.renderShipPick(game.getShipPick());
};

const addShipPositionRandom = () => {
  const user = game.getCurrentPlayer();

  user.addRandomShipsPosition();

  gameplayView.renderGameboardRandom(user.getPlayerBoard());
  if (!game.emptyQueue()) {
    game.clearQueueShip();
    gameplayView.hideShipPick();
    gameplayView.showPlayButton();
  }
};

const addShipPosition = (data) => {
  const { posA, posB } = data;
  const user = game.getCurrentPlayer();
  let ship = game.getQueueShip();

  const onBoard = user.addShipOnPlayerGameboard(posA, posB, ship);

  if (!onBoard) return;

  gameplayView.renderGameboardShip(data, ship);
  game.dequeShip();
  gameplayView.renderShipPick(game.getShipPick());
};

const changeShipDirection = () => {
  game.changeGameboardDirection();
  gameplayView.renderShipPick(game.getShipPick());
};

const playComputerTurn = () => {
  // remember now that players are switched
  // now current player is Computer player !!!!
  // now enemy is user player !!!
  const computer = game.getCurrentPlayer();
  const randomPosition = computer.getEnemyPositionBoard();
  attackGameboard(randomPosition);
};

// function show modal window when player sunk all ships
const endGame = async () => {
  gameplayView.removeClickComputerGameboard(playGame);
  modalView.renderGameResult(game.getCurrentName());

  gameplayView.clearPlayerTurn();
  modalView.toggleModal();
  await (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_0__.sleep)(0.5);
  modalView.animateModal();
};

// function update game state
const updateGame = async (ship) => {
  // check if ship exists on cell,
  if (!ship) {
    game.switchPlayers();
    gameplayView.hidePlayerTurn();
    gameplayView.switchGamePanel();
    await (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_0__.sleep)(0.15);
    gameplayView.changePlayerTurn(game.getCurrentName());

    return;
  }

  const currentPlayer = game.getCurrentPlayer();
  const enemyPlayer = game.getEnemyPlayer();

  if (!game.userPlaying()) {
    // we set true random position around target ship
    currentPlayer.selectShipHitting();
  }

  // check if targetShip is full Sunk
  if (ship.getSunk()) {
    // check action for computer play
    if (!game.userPlaying()) {
      currentPlayer.deselectShipHitting(); //after unchecking these settings we draw random position on board
      currentPlayer.clearPotentialShipPositions(); // we not need potential position after sunk ship around ship fields on enemy board
      // we remove also reserved positions around ship fields from potential computer positions
      currentPlayer.clearReservedPositions(ship.getReservedPositions());
    }
    enemyPlayer.increaseSunkenShips();
    // set reserved cells as marked
    enemyPlayer.addReservedShipPositions(ship.getReservedPositions());

    // render reserved cells on gameboard element
    gameplayView.renderReservedPositions(
      enemyPlayer.getType(),
      ship.getReservedPositions()
    );

    // render sunk ship on ship list element
    gameplayView.renderSunkShip(ship.getID());
    // gameplayView.renderSunkShip(enemyPlayer);
  }
  // check if all enemy ships are sunken
  if (enemyPlayer.allSunkenShips()) {
    endGame();
  }
};

const attackGameboard = async (position) => {
  // const position = gameplayView.getComputerBoardPosition(event);
  // if (!position) return;

  if (game.getTimer()) return;

  // get current and enemy players
  const currentPlayer = game.getCurrentPlayer();
  const enemyPlayer = game.getEnemyPlayer();

  // get position of enemy cell from gameboard;
  const enemyCell = currentPlayer.attackEnemyGameboard(position, enemyPlayer);

  // check if enemyCell is marked or hit
  if (!enemyCell) return;

  // ship object from board array
  const ship = enemyCell.shipCell;

  // render mark on target cell
  gameplayView.renderMarkedCell(position, ship, enemyPlayer.getType());

  // update game state
  updateGame(ship);
  // stop turn when current player is user or game is over
  if (game.userPlaying() || game.stopPlaying()) return;
  game.setTimer(playComputerTurn);
};

// function make gameplay between user and computer
const playGame = (event) => {
  if (game.getTimer() || game.getDelay() || !game.userPlaying()) return;
  const position = gameplayView.getComputerBoardPosition(event);
  if (!position) return;
  attackGameboard(position);
};

const runGame = () => {
  const user = game.getCurrentPlayer();
  const computer = game.getEnemyPlayer();
  computer.addRandomShipsPosition();
  computer.addGameboardPositions(user.getPlayerBoard());

  game.clearQueueShip();
  gameplayView.hidePlayButton();
  gameplayView.renderPlayerTurn(user.getName());
  gameplayView.switchGamePanel();
  gameplayView.onClickComputerGameboard(playGame);
};

const startGame = (name) => {
  if (!name) {
    menuView.showError();
    return;
  }
  const players = game.getPlayers();
  const playerGameboard = game.getCurrentPlayerGameboard();
  const shipPick = game.getShipPick();

  game.setUserPlayerName(name);

  gameplayView.renderGameplay(players);
  gameplayView.renderShipPick(shipPick);

  gameplayView.onClickShipEl(changeShipDirection);
  gameplayView.onDragShipEl(playerGameboard);
  gameplayView.onDropShipEl(addShipPosition);

  gameplayView.onClickRandomBtn(addShipPositionRandom);
  gameplayView.onClickResetBtn(resetGameboard);
  gameplayView.onClickPlayBtn(runGame);
  menuView.hideStartMenu();
};

const restartGame = async function () {
  game.restartGame();

  gameplayView.renderGameplay(game.getPlayers());
  gameplayView.renderShipPick(game.getShipPick());

  modalView.animateModal();
  await (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_0__.sleep)(0.5);
  modalView.toggleModal();
};

const init = () => {
  menuView.onClickStartButton(startGame);
  modalView.onClickRestartBtn(restartGame);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (init);


/***/ }),

/***/ "./src/js/modules/model/gameboard/gameboard.js":
/*!*****************************************************!*\
  !*** ./src/js/modules/model/gameboard/gameboard.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/constants */ "./src/js/utils/constants.js");
/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/helpers */ "./src/js/utils/helpers.js");



class Gameboard {
  static maxSize = 10;
  board = [];

  directions = [_utils_constants__WEBPACK_IMPORTED_MODULE_0__.HORIZONTAL, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.VERTICAL];

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

    if (direction === _utils_constants__WEBPACK_IMPORTED_MODULE_0__.HORIZONTAL) {
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
    } else if (direction === _utils_constants__WEBPACK_IMPORTED_MODULE_0__.VERTICAL) {
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
      let posA = (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.getRandomNumber)(Gameboard.maxSize);
      let posB = (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.getRandomNumber)(Gameboard.maxSize);

      let direction = (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.getRandomNumber)(this.directions.length);
      // let direction = Math.floor(Math.random() * this.directions.length);

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

  addReservedShipPositions(reservedPositions) {
    reservedPositions.forEach((position) => {
      const { posA, posB } = position;
      if (!this.board[posA][posB].marked) this.board[posA][posB].marked = true;
    });
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);


/***/ }),

/***/ "./src/js/modules/model/index.js":
/*!***************************************!*\
  !*** ./src/js/modules/model/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/constants */ "./src/js/utils/constants.js");
/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/helpers */ "./src/js/utils/helpers.js");
/* harmony import */ var _players_computer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./players/computer */ "./src/js/modules/model/players/computer.js");
/* harmony import */ var _players_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./players/user */ "./src/js/modules/model/players/user.js");
/* harmony import */ var _queue_queue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./queue/queue */ "./src/js/modules/model/queue/queue.js");






class Game {
  shipQueue = new _queue_queue__WEBPACK_IMPORTED_MODULE_4__.Queue();
  currentPlayer = new _players_user__WEBPACK_IMPORTED_MODULE_3__["default"]();
  enemyPlayer = new _players_computer__WEBPACK_IMPORTED_MODULE_2__["default"]();
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
    return this.currentPlayer instanceof _players_user__WEBPACK_IMPORTED_MODULE_3__["default"];
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

  async setTimer(cb) {
    this.timer = true;

    await (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sleep)(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.TIME_OUT);
    this.timer = false;
    cb();
    this.delay = true;
    await (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_1__.sleep)(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.TIME_DELAY);
    this.delay = false;
  }

  // setTimer(cb) {
  //   this.timer = setTimeout(() => {
  //     this.timer = null;
  //     console.log("timer is over");
  //     cb();
  //     this.delay = setTimeout(() => {
  //       this.delay = null;
  //       console.log("delay is over");
  //     }, 350);
  //   }, TIME_OUT);
  // }

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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);


/***/ }),

/***/ "./src/js/modules/model/players/computer.js":
/*!**************************************************!*\
  !*** ./src/js/modules/model/players/computer.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/helpers */ "./src/js/utils/helpers.js");
/* harmony import */ var _shipPosition_shipPosition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shipPosition/shipPosition */ "./src/js/modules/model/shipPosition/shipPosition.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./player */ "./src/js/modules/model/players/player.js");




class Computer extends _player__WEBPACK_IMPORTED_MODULE_2__["default"] {
  availablePositions = [];
  shipHit;

  position;
  potentialShipPositions = new _shipPosition_shipPosition__WEBPACK_IMPORTED_MODULE_1__["default"]();

  constructor() {
    super();
    this.shipHit = false;
    this.name = "computer";
  }

  getType() {
    return this.name;
  }

  getName() {
    return this.name;
  }

  selectShipHitting() {
    this.shipHit = true;
  }

  deselectShipHitting() {
    this.shipHit = false;
  }

  // method add all possible board positions
  // to availablePositions array
  addGameboardPositions(board) {
    // set user board for computer to know what moves it can do
    // around hit ship cell
    this.potentialShipPositions.setBoard(board);

    if (this.availablePositions.length !== 0)
      this.availablePositions.length = 0;
    // const board = this.getPlayerBoard();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        this.availablePositions.push({ posA: i, posB: j });
      }
    }
  }

  // method returns potential board ship position for computer
  getEnemyPositionBoard() {
    // if  ship was hit, get only positions
    // around that ship hit position
    if (this.shipHit) {
      const nextPosition = this.potentialShipPositions.getAdjacentHitPositions(
        this.position
      );
      this.position = nextPosition; // assign this  position to property

      // search correct index of availablePositions array
      const index = (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_0__.binarySearch)(this.availablePositions, this.position);
      // next remove the position from availabePosition array
      if (index !== -1) this.availablePositions.splice(index, 1);
      else {
        this.position = this.availablePositions.pop();

        this.potentialShipPositions.clearPotentialPosition();
      }

      // otherwise randomly get potential board ship
      // position from availablePosition array
    } else {
      const randomNumber = (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_0__.getRandomNumber)(this.availablePositions.length);
      // const randomNumber = Math.floor(
      //   Math.random() * this.availablePositions.length
      // );

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
      const index = (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_0__.binarySearch)(this.availablePositions, position);
      if (index >= 0) this.availablePositions.splice(index, 1);
    });
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Computer);


/***/ }),

/***/ "./src/js/modules/model/players/player.js":
/*!************************************************!*\
  !*** ./src/js/modules/model/players/player.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/constants */ "./src/js/utils/constants.js");
/* harmony import */ var _gameboard_gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../gameboard/gameboard */ "./src/js/modules/model/gameboard/gameboard.js");
/* harmony import */ var _ship_ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ship/ship */ "./src/js/modules/model/ship/ship.js");




class Player {
  gameboard = new _gameboard_gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
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
    _utils_constants__WEBPACK_IMPORTED_MODULE_0__.SHIP_SIZES.forEach((size) => {
      let ship = new _ship_ship__WEBPACK_IMPORTED_MODULE_2__["default"](size);
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);


/***/ }),

/***/ "./src/js/modules/model/players/user.js":
/*!**********************************************!*\
  !*** ./src/js/modules/model/players/user.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/js/modules/model/players/player.js");


class User extends _player__WEBPACK_IMPORTED_MODULE_0__["default"] {
  name;

  constructor() {
    super();
  }

  getType() {
    return "user";
  }

  getName() {
    return this.name || "Unknown";
  }

  setName(name) {
    this.name = name;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (User);


/***/ }),

/***/ "./src/js/modules/model/queue/queue.js":
/*!*********************************************!*\
  !*** ./src/js/modules/model/queue/queue.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Queue: () => (/* binding */ Queue)
/* harmony export */ });
class Queue {
  elements = {};
  head = 0;
  tail = 0;

  clearQueue() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }

  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }

  peek() {
    return this.elements[this.head];
  }

  countElement(cb) {
    let count = 0;
    for (const el in this.elements) {
      const current = this.elements[el];
      const condition = cb(current);
      if (condition) break;
      count++;
    }
    return count;
  }

  getLength() {
    return this.tail - this.head;
  }

  isEmpty() {
    return this.getLength() === 0;
  }

  addElements(elements) {
    this.clearQueue();
    for (let el of elements) this.enqueue(el);
  }
}


/***/ }),

/***/ "./src/js/modules/model/shipPosition/shipPosition.js":
/*!***********************************************************!*\
  !*** ./src/js/modules/model/shipPosition/shipPosition.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/helpers */ "./src/js/utils/helpers.js");


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

    const randomNumber = (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_0__.getRandomNumber)(this.potentialShipPositions.length);
    // const randomNumber = Math.floor(
    //   Math.random() * this.potentialShipPositions.length
    // );

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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShipPosition);


/***/ }),

/***/ "./src/js/modules/model/ship/ship.js":
/*!*******************************************!*\
  !*** ./src/js/modules/model/ship/ship.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nanoid */ "./node_modules/nanoid/index.browser.js");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/constants */ "./src/js/utils/constants.js");



class Ship {
  id;
  length;
  hits = 0;
  reservedPositions = [];

  constructor(l) {
    this.length = l;
    this.id = this.createCustomID();
  }

  getID() {
    return this.id;
  }

  getLength() {
    return this.length;
  }

  getHits() {
    return this.hits;
  }

  getSunk() {
    return this.hits === this.length;
  }

  getReservedPositions() {
    return this.reservedPositions;
  }

  createCustomID() {
    let nanoid = (0,nanoid__WEBPACK_IMPORTED_MODULE_1__.customAlphabet)(_utils_constants__WEBPACK_IMPORTED_MODULE_0__.CUSTOM_ALPHABET, _utils_constants__WEBPACK_IMPORTED_MODULE_0__.SIZE_ID);
    return nanoid();
  }

  clearReservedPositions() {
    this.reservedPositions.length = 0;
  }

  addReservedPositions(pos) {
    this.reservedPositions.push(pos);
  }

  receiveHit() {
    if (this.hits < this.length) {
      this.hits++;
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);


/***/ }),

/***/ "./src/js/modules/view/gameplayView.js":
/*!*********************************************!*\
  !*** ./src/js/modules/view/gameplayView.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/constants */ "./src/js/utils/constants.js");


class GameplayView {
  gameEl = document.querySelector(".game");
  gameUserEl = document.getElementById("user");
  gameComputerEl = document.getElementById("computer");

  gameboardUserEl = this.gameUserEl.querySelector(".game-board");
  gameboardComputerEl = this.gameComputerEl.querySelector(".game-board");

  gameControlsEl = this.gameUserEl.querySelector(".game-controls");
  gameShipEl = this.gameUserEl.querySelector(".game-ship");

  gameShipObjectEl = this.gameUserEl.querySelector(".game-ship-object");
  gameShipAmountEl = this.gameUserEl.querySelector(".game-ship-amount");

  playGameButton = document.getElementById("play");
  randomShipButton = document.getElementById("random");
  resetShipButton = document.getElementById("reset");

  draggedEl = null;

  showGameplay() {
    this.gameEl.classList.remove("hidden");
    this.gameControlsEl.classList.remove("hidden");
    this.showShipPick();
  }

  renderGameplay(players) {
    players.forEach((player) => {
      const type = player.getType();
      const name = player.getName();
      const board = player.getPlayerBoard();
      const ships = player.getShips();

      const playerEl = document.getElementById(type);
      const playerNameEl = playerEl.querySelector(".game-playername");
      const gameboardEl = playerEl.querySelector(".game-board");
      const shipListEl = playerEl.querySelector(".game-list-ship");

      this.renderPlayername(playerNameEl, name);
      this.renderGameboard(gameboardEl, board);
      this.renderShipList(shipListEl, ships);
    });

    this.renderInitialGamePanels();
    // this.toggleGamePanel(this.gameComputerEl);
    this.showGameplay();
  }

  renderInitialGamePanels() {
    this.gameUserEl.querySelector(".game-panel").classList.remove("disabled");
    this.gameComputerEl.querySelector(".game-panel").classList.add("disabled");
  }

  renderPlayername(element, name) {
    const playername = name || "unknown";
    element.textContent = playername + "'s board";
  }

  renderGameboardRandom(board) {
    const gameboardEl = this.gameUserEl.querySelector(".game-board");
    this.renderGameboard(gameboardEl, board);
  }

  renderGameboard(element, board) {
    element.innerHTML = "";

    const size = board.length * board.length;

    for (let i = 0; i < size; i++) {
      let position = ("0" + i).slice(-2);
      const [posA, posB] = position.split("");

      const span = document.createElement("span");

      const cls = board[+posA][+posB].shipCell
        ? "game-cell game-cell-ship"
        : "game-cell";

      span.className = cls;

      span.dataset.posA = posA;
      span.dataset.posB = posB;

      element.appendChild(span);
    }
  }

  renderShipList(el, ships) {
    el.innerHTML = "";

    for (let i = 0; i < ships.length; i++) {
      const li = document.createElement("li");
      const shipLength = ships[i].getLength();
      const shipID = ships[i].getID();

      li.dataset.shipId = shipID;
      li.className = "game-item-ship";

      for (let j = 0; j < shipLength; j++) {
        const span = document.createElement("span");
        span.className = "game-item-part";
        li.appendChild(span);
      }
      el.appendChild(li);
    }
  }

  renderShipPick(shipPick) {
    const { ship, currentShipLeft, direction } = shipPick;
    this.showShipPick();
    this.gameShipObjectEl.innerHTML = "";
    this.gameShipObjectEl.setAttribute("data-direction", direction);

    if (!ship) {
      this.hideShipPick();
      this.showPlayButton();
      return;
    }

    const shipLength = ship.getLength();

    for (let i = 0; i < shipLength; i++) {
      const span = document.createElement("span");
      span.className = "game-ship-part";

      this.gameShipObjectEl.appendChild(span);
    }

    if (direction === _utils_constants__WEBPACK_IMPORTED_MODULE_0__.HORIZONTAL) {
      this.gameShipObjectEl.style.gridTemplateColumns = `repeat(${this.gameShipObjectEl.children.length}, 1fr)`;
    } else {
      this.gameShipObjectEl.style.gridTemplateColumns = `repeat(1, 1fr)`;
    }

    this.gameShipAmountEl.textContent = `x${currentShipLeft}`;
  }

  renderGameboardShip(dataBoard, ship) {
    const { posA, posB, direction } = dataBoard;

    for (let i = 0; i < ship.getLength(); i++) {
      const cellPosA = direction === _utils_constants__WEBPACK_IMPORTED_MODULE_0__.VERTICAL ? i * 1 + +posA : +posA;
      const cellPosB = direction === _utils_constants__WEBPACK_IMPORTED_MODULE_0__.VERTICAL ? +posB : +posB + i * 1;
      const partEl = this.gameUserEl.querySelector(
        `[data-pos-a="${cellPosA}"][data-pos-b="${cellPosB}"]`
      );
      partEl.classList.add("game-cell-ship");
    }
  }

  renderPlayerTurn(name) {
    const html = `<div class="game-turn">
    <div class="game-current-name opaque">${name}'s turn</div>
  </div>`;
    this.gameEl.insertAdjacentHTML("beforeend", html);
    // this.gameEl.insertAdjacentHTML("afterbegin", html);
  }

  clearPlayerTurn() {
    const el = this.gameEl.querySelector(".game-turn");
    el.remove();
  }

  renderMarkedCell(position, ship, type) {
    const { posA, posB } = position;
    const gameboardEl = document.getElementById(type);

    const targetCellEl = gameboardEl.querySelector(
      `[data-pos-a="${posA}"][data-pos-b="${posB}"]`
    );

    if (!ship) targetCellEl.classList.add("reserved");

    const span = document.createElement("span");
    span.className = ship ? "hit" : "miss";

    targetCellEl.appendChild(span);
  }

  renderReservedPositions(type, reservedPositions) {
    const gameboardEl = document.getElementById(type);

    reservedPositions.forEach((position) => {
      const { posA, posB } = position;
      const cellEl = gameboardEl.querySelector(
        `[data-pos-a="${posA}"][data-pos-b="${posB}"]`
      );

      if (!cellEl.classList.contains("reserved")) {
        cellEl.classList.add("reserved");
        const span = document.createElement("span");
        span.className = "miss";
        cellEl.appendChild(span);
      }
    });
  }

  renderSunkShip(id) {
    const shipItemEl = document.querySelector(`[data-ship-id="${id}"]`);
    shipItemEl.classList.add("sunk");
  }

  changePlayerTurn(name) {
    const el = this.gameEl.querySelector(".game-current-name");
    el.textContent = `${name}'s turn`;
    el.classList.add("opaque");
  }

  hidePlayerTurn() {
    const el = this.gameEl.querySelector(".game-current-name");
    el.classList.remove("opaque");
  }

  showShipPick() {
    this.gameShipEl.classList.remove("hidden");
  }

  hideShipPick() {
    this.gameShipEl.classList.add("hidden");
  }

  showPlayButton() {
    this.playGameButton.classList.remove("hidden");
  }

  hidePlayButton() {
    this.playGameButton.classList.add("hidden");
  }

  showReservedCells(board) {
    this.gameboardUserEl.querySelectorAll(".game-cell").forEach((cell) => {
      const { posA, posB } = cell.dataset;
      const { reserved } = board[+posA][+posB];

      if (reserved) {
        cell.classList.add("cell-disabled");
      }
    });
  }

  hideReservedCells(board) {
    this.gameboardUserEl.querySelectorAll(".game-cell").forEach((cell) => {
      const { posA, posB } = cell.dataset;
      const { reserved } = board[+posA][+posB];

      if (reserved) {
        cell.classList.remove("cell-disabled");
      }
    });
  }

  toggleGamePanel(el) {
    el.querySelector(".game-panel").classList.toggle("disabled");
  }

  switchGamePanel() {
    this.toggleGamePanel(this.gameComputerEl);
    this.toggleGamePanel(this.gameUserEl);
  }

  getComputerBoardPosition(event) {
    const target = event.target;

    const cellEl = target.classList.contains("game-cell");
    if (!cellEl) return;

    const { posA, posB } = event.target.dataset;

    return { posA, posB };
  }

  // EVENT FUNCTIONS

  onClickPlayBtn(cb) {
    this.playGameButton.addEventListener("click", () => {
      this.gameControlsEl.classList.add("hidden");
      cb();
    });
  }

  // reset button event
  onClickResetBtn(cb) {
    this.resetShipButton.addEventListener("click", () => {
      cb();
    });
  }

  // random button event
  onClickRandomBtn(cb) {
    this.randomShipButton.addEventListener("click", () => {
      cb();
    });
  }

  // ship object el events
  onClickShipEl(cb) {
    this.gameShipObjectEl.addEventListener("click", () => {
      cb();
    });
  }

  onDragShipEl(board) {
    // start draggable
    this.gameShipObjectEl.addEventListener("dragstart", (event) => {
      this.draggedEl = event.target; // target element, which is draggeble
      this.showReservedCells(board);
    });

    this.gameShipObjectEl.addEventListener("dragend", () => {
      // fires when user en to drag element;
      this.hideReservedCells(board);
    });
  }

  onDropShipEl(cb) {
    // const gameBoardEl = this.gameUserEl.querySelector(".game-board");

    this.gameboardUserEl.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    this.gameboardUserEl.addEventListener("drop", (event) => {
      event.preventDefault();

      if (!this.draggedEl || !event.target.classList.contains("game-cell"))
        return;

      const { posA, posB } = event.target.dataset;
      const { direction } = this.draggedEl.dataset;

      const dataDOM = {
        posA,
        posB,
        direction,
      };

      this.draggedEl = null;

      cb(dataDOM);
    });
  }

  onClickComputerGameboard(cb) {
    this.gameboardComputerEl.addEventListener("click", cb);
  }

  removeClickComputerGameboard(cb) {
    this.gameboardComputerEl.removeEventListener("click", cb);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameplayView);


/***/ }),

/***/ "./src/js/modules/view/menuView.js":
/*!*****************************************!*\
  !*** ./src/js/modules/view/menuView.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class MenuView {
  menuEl = document.querySelector(".menu");
  fieldEl = document.querySelector(".menu-field");
  inputEl = document.getElementById("player_name");

  startBtn = document.getElementById("btn-start-game");

  menuErrorEl;

  constructor() {
    this.renderIcon();
    this.inputEl.focus();
    this.onChangeInput();
    this.menuErrorEl = this.renderMenuError();
  }

  onClickStartButton(callback) {
    this.startBtn.addEventListener("click", () => {
      callback(this.inputEl.value);
    });
  }

  showError() {
    if (!document.contains(this.menuErrorEl))
      this.fieldEl.insertAdjacentElement("afterbegin", this.menuErrorEl);
  }

  renderMenuError() {
    const div = document.createElement("div");
    div.className = "menu-error";
    div.textContent = "Ups! You forgot a name!";

    return div;
  }

  hideStartMenu() {
    this.menuEl.classList.remove("show");
  }

  renderIcon() {
    const svg = `<svg
    id="target-icon"
    width="100%"
    height="100%"
    viewBox="0 0 144.49777 144.49777"
    version="1.1"
    xml:space="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"
  >
    <defs  />
    <g transform="translate(-39.405251,-42.475737)">
      <path
        style="fill: #ffffff"
        d="m 107.4208,182.50197 v -4.46954 l -3.09572,-0.33576 C 93.180727,176.48996 82.443156,172.13145 72.989692,164.97927 69.906106,162.64633 63.73243,156.47266 61.39949,153.38907 54.24731,143.93561 49.888807,133.19804 48.680096,122.05368 l -0.33576,-3.09572 h -4.469543 -4.469544 v -4.23333 -4.23334 h 4.469544 4.469543 l 0.33576,-3.09572 C 49.888807,96.251219 54.24731,85.513649 61.39949,76.060179 63.73243,72.976599 69.906106,66.802919 72.989692,64.46998 82.443156,57.3178 93.180727,52.959297 104.32508,51.750587 l 3.09572,-0.335761 V 46.945283 42.47574 h 4.23334 4.23333 v 4.469543 4.469543 l 3.09572,0.335761 c 11.14436,1.20871 21.88193,5.567213 31.33539,12.719393 3.08359,2.332939 9.25726,8.506619 11.5902,11.590199 7.15218,9.45347 11.51069,20.19104 12.7194,31.335391 l 0.33576,3.09572 h 4.46954 4.46954 v 4.23334 4.23333 h -4.46954 -4.46954 l -0.33576,3.09572 c -1.20871,11.14436 -5.56722,21.88193 -12.7194,31.33539 -2.33294,3.08359 -8.50661,9.25726 -11.5902,11.5902 -9.45346,7.15218 -20.19103,11.51069 -31.33539,12.7194 l -3.09572,0.33576 v 4.46954 4.46954 h -4.23333 -4.23334 z m 0,-21.45904 v -8.43081 l -2.61055,-0.47546 c -5.107111,-0.93014 -10.414911,-3.13189 -14.855333,-6.16218 -2.759223,-1.88299 -7.669647,-6.79341 -9.552634,-9.55264 -3.030294,-4.44042 -5.232039,-9.74822 -6.162185,-14.85532 l -0.475455,-2.61056 h -8.467274 -8.467275 l 0.200078,2.04611 c 1.875512,19.18009 15.433142,37.10356 33.73952,44.60435 4.769001,1.95403 11.774188,3.67246 15.592778,3.82503 l 1.05833,0.0423 z m 15.19644,7.56248 c 21.59591,-4.43051 38.48917,-21.32377 42.91968,-42.91968 0.29761,-1.45065 0.63114,-3.5583 0.74118,-4.68366 l 0.20008,-2.04611 h -8.46728 -8.46727 l -0.47546,2.61056 c -0.93014,5.1071 -3.13189,10.4149 -6.16218,14.85532 -1.88299,2.75923 -6.79341,7.66965 -9.55263,9.55264 -4.44043,3.03029 -9.74823,5.23204 -14.85533,6.16218 l -2.61056,0.47546 v 8.46727 8.46728 l 2.04611,-0.20008 c 1.12536,-0.11004 3.23301,-0.44358 4.68366,-0.74118 z m -15.19644,-28.6239 v -4.09222 h 4.23334 4.23333 v 4.10501 4.10501 l 1.05833,-0.18387 c 0.58209,-0.10112 2.4296,-0.6323 4.10558,-1.18038 8.76437,-2.86616 15.74904,-9.85082 18.61519,-18.61519 0.54808,-1.67598 1.07926,-3.52349 1.18039,-4.10558 l 0.18386,-1.05833 h -4.10501 -4.10501 v -4.23333 -4.23334 h 4.10501 4.10501 l -0.18386,-1.05833 c -0.10113,-0.58208 -0.63231,-2.42959 -1.18039,-4.10558 -2.86615,-8.764361 -9.85082,-15.749031 -18.61519,-18.615181 -1.67598,-0.54809 -3.52349,-1.07926 -4.10558,-1.18039 l -1.05833,-0.18387 v 4.10501 4.10501 h -4.23333 -4.23334 v -4.10501 -4.10501 l -1.05833,0.18387 c -0.58208,0.10113 -2.42959,0.6323 -4.10558,1.18039 -8.764364,2.86615 -15.749033,9.85082 -18.615184,18.615181 -0.548086,1.67599 -1.079261,3.5235 -1.180389,4.10558 l -0.183868,1.05833 h 4.10501 4.105011 v 4.23334 4.23333 h -4.105011 -4.10501 l 0.183868,1.05833 c 0.702151,4.04152 3.227214,9.53426 6.087111,13.24122 2.702061,3.50237 7.763152,7.26059 11.957512,8.87929 2.11735,0.81713 5.77302,1.88864 6.56209,1.9234 0.26671,0.0118 0.35277,-0.98277 0.35277,-4.07669 z m 1.72391,-12.86414 c -6.41043,-1.25893 -11.025709,-7.85841 -9.966399,-14.25114 0.917429,-5.53649 5.082939,-9.702 10.619429,-10.61943 8.16074,-1.35228 15.6845,6.17148 14.33222,14.33223 -1.1916,7.19108 -7.92341,11.92521 -14.98525,10.53834 z M 74.240098,107.88074 c 0.930146,-5.10711 3.131891,-10.414911 6.162185,-14.855331 1.882987,-2.75923 6.793411,-7.66965 9.552634,-9.55264 4.440422,-3.03029 9.748222,-5.23203 14.855333,-6.16218 l 2.61055,-0.47546 v -8.46727 -8.467274 l -2.04611,0.200077 C 95.854778,61.03156 85.544849,65.286076 77.697738,71.521889 66.091959,80.744579 58.394076,94.497099 57.030172,108.44518 l -0.200078,2.04611 h 8.467275 8.467274 z m 92.038002,0.56444 C 164.9142,94.497099 157.21631,80.744579 145.61054,71.521889 137.76342,65.286076 127.45349,61.03156 117.93358,60.100662 l -2.04611,-0.200077 v 8.467274 8.46727 l 2.61056,0.47546 c 5.1071,0.93015 10.4149,3.13189 14.85533,6.16218 2.75922,1.88299 7.66964,6.79341 9.55263,9.55264 3.03029,4.44042 5.23204,9.748221 6.16218,14.855331 l 0.47546,2.61055 h 8.46727 8.46728 z"
      />
    </g>
  </svg>`;

    this.menuEl.insertAdjacentHTML("beforeend", svg);
  }

  onChangeInput() {
    this.inputEl.addEventListener("input", (e) => {
      if (e.target.value && document.contains(this.menuErrorEl))
        this.fieldEl.removeChild(this.menuErrorEl);
    });
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MenuView);


/***/ }),

/***/ "./src/js/modules/view/modalView.js":
/*!******************************************!*\
  !*** ./src/js/modules/view/modalView.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class ModalView {
  modalEl = document.querySelector(".modal");
  resultEl = document.querySelector(".result");
  descEl = document.querySelector(".desc");
  restartBtnEl = document.getElementById("restart");

  toggleModal() {
    this.modalEl.classList.toggle("hidden");
  }

  animateModal() {
    this.modalEl.classList.toggle("opaque");
  }

  renderGameResult(name) {
    this.resultEl.textContent = name === "computer" ? "Defeat!" : "Victory!";
    this.descEl.textContent = `${name} has won!`;
  }

  onClickRestartBtn(cb) {
    this.restartBtnEl.addEventListener("click", cb);
  }

  removeClickRestartBtn(cb) {
    this.restartBtnEl.removeEventListener("click", cb);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModalView);


/***/ }),

/***/ "./src/js/utils/constants.js":
/*!***********************************!*\
  !*** ./src/js/utils/constants.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CUSTOM_ALPHABET: () => (/* binding */ CUSTOM_ALPHABET),
/* harmony export */   HORIZONTAL: () => (/* binding */ HORIZONTAL),
/* harmony export */   SHIP_SIZES: () => (/* binding */ SHIP_SIZES),
/* harmony export */   SIZE_ID: () => (/* binding */ SIZE_ID),
/* harmony export */   TIME_DELAY: () => (/* binding */ TIME_DELAY),
/* harmony export */   TIME_OUT: () => (/* binding */ TIME_OUT),
/* harmony export */   VERTICAL: () => (/* binding */ VERTICAL)
/* harmony export */ });
const SHIP_SIZES = [4, 4, 3, 3, 2, 2, 1, 1];

const CUSTOM_ALPHABET = "1234567890abcdef";
const SIZE_ID = 10;

const HORIZONTAL = "horizontal";
const VERTICAL = "vertical";

const TIME_OUT = 1;
const TIME_DELAY = 0.35;


/***/ }),

/***/ "./src/js/utils/helpers.js":
/*!*********************************!*\
  !*** ./src/js/utils/helpers.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   binarySearch: () => (/* binding */ binarySearch),
/* harmony export */   getRandomNumber: () => (/* binding */ getRandomNumber),
/* harmony export */   sleep: () => (/* binding */ sleep)
/* harmony export */ });
const concatNumbers = (pos) => {
  const { posA, posB } = pos;

  const str = "" + posA + posB;

  return Number(str);
};

const binarySearch = function (arr, index) {
  let left = 0;
  let right = arr.length - 1;
  let mid;

  const indexNumber = concatNumbers(index);

  while (right >= left) {
    mid = left + Math.floor((right - left) / 2);

    // if the element is present at the middle itsef

    const midNumber = concatNumbers(arr[mid]);
    if (midNumber === indexNumber) return mid;

    // if element is smalled then mid, then
    // it can only be present in the left subaaray
    if (midNumber > indexNumber) right = mid - 1;
    // otherwise the element can only be present
    // in the right subarray
    else left = mid + 1;
  }

  return -1;
};

const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

const sleep = (s) => {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
  // return new Promise((resolve) => {
  //   setTimeout(() => {}, s);
  // });
};


/***/ }),

/***/ "./node_modules/nanoid/index.browser.js":
/*!**********************************************!*\
  !*** ./node_modules/nanoid/index.browser.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   customAlphabet: () => (/* binding */ customAlphabet),
/* harmony export */   customRandom: () => (/* binding */ customRandom),
/* harmony export */   nanoid: () => (/* binding */ nanoid),
/* harmony export */   random: () => (/* binding */ random),
/* harmony export */   urlAlphabet: () => (/* reexport safe */ _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__.urlAlphabet)
/* harmony export */ });
/* harmony import */ var _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./url-alphabet/index.js */ "./node_modules/nanoid/url-alphabet/index.js");

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)
  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random)
let nanoid = (size = 21) =>
  crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte > 62) {
      id += '-'
    } else {
      id += '_'
    }
    return id
  }, '')


/***/ }),

/***/ "./node_modules/nanoid/url-alphabet/index.js":
/*!***************************************************!*\
  !*** ./node_modules/nanoid/url-alphabet/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   urlAlphabet: () => (/* binding */ urlAlphabet)
/* harmony export */ });
const urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_modules_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/modules/controller */ "./src/js/modules/controller.js");
/* harmony import */ var _sass_main_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sass/main.scss */ "./src/sass/main.scss");



console.log("hello");
(0,_js_modules_controller__WEBPACK_IMPORTED_MODULE_0__["default"])();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsYUFBYTtBQUMzQixjQUFjLFlBQVk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFlLFlBQVksRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDalc1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxRQUFRLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ3RFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsTUFBTTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1QmxCO0FBQ1A7QUFDTztBQUNBO0FBQ1A7QUFDTztBQUNBO0FBQ1A7QUFDTztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1RQO0FBQ0EsVUFBVSxhQUFhO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQixNQUFNO0FBQ047Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0NxRDtBQUM5QztBQUNBO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7Ozs7Ozs7Ozs7Ozs7OztBQ2hDSTtBQUNQOzs7Ozs7O1VDREE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOMkM7QUFDakI7QUFDMUI7QUFDQTtBQUNBLGtFQUFJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL3Nhc3MvbWFpbi5zY3NzP2E0ZTYiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2pzL21vZHVsZXMvY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvanMvbW9kdWxlcy9tb2RlbC9nYW1lYm9hcmQvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9qcy9tb2R1bGVzL21vZGVsL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9qcy9tb2R1bGVzL21vZGVsL3BsYXllcnMvY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2pzL21vZHVsZXMvbW9kZWwvcGxheWVycy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2pzL21vZHVsZXMvbW9kZWwvcGxheWVycy91c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9qcy9tb2R1bGVzL21vZGVsL3F1ZXVlL3F1ZXVlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9qcy9tb2R1bGVzL21vZGVsL3NoaXBQb3NpdGlvbi9zaGlwUG9zaXRpb24uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2pzL21vZHVsZXMvbW9kZWwvc2hpcC9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9qcy9tb2R1bGVzL3ZpZXcvZ2FtZXBsYXlWaWV3LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9qcy9tb2R1bGVzL3ZpZXcvbWVudVZpZXcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2pzL21vZHVsZXMvdmlldy9tb2RhbFZpZXcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2pzL3V0aWxzL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvanMvdXRpbHMvaGVscGVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9ub2RlX21vZHVsZXMvbmFub2lkL2luZGV4LmJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vbm9kZV9tb2R1bGVzL25hbm9pZC91cmwtYWxwaGFiZXQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCB7IHNsZWVwIH0gZnJvbSBcIi4uL3V0aWxzL2hlbHBlcnNcIjtcclxuaW1wb3J0IEdhbWUgZnJvbSBcIi4vbW9kZWxcIjtcclxuaW1wb3J0IEdhbWVwbGF5VmlldyBmcm9tIFwiLi92aWV3L2dhbWVwbGF5Vmlld1wiO1xyXG5pbXBvcnQgTWVudVZpZXcgZnJvbSBcIi4vdmlldy9tZW51Vmlld1wiO1xyXG5pbXBvcnQgTW9kYWxWaWV3IGZyb20gXCIuL3ZpZXcvbW9kYWxWaWV3XCI7XHJcblxyXG5jb25zdCBtZW51VmlldyA9IG5ldyBNZW51VmlldygpO1xyXG5jb25zdCBnYW1lcGxheVZpZXcgPSBuZXcgR2FtZXBsYXlWaWV3KCk7XHJcbmNvbnN0IG1vZGFsVmlldyA9IG5ldyBNb2RhbFZpZXcoKTtcclxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcblxyXG5jb25zdCByZXNldEdhbWVib2FyZCA9ICgpID0+IHtcclxuICBjb25zdCB1c2VyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XHJcblxyXG4gIHVzZXIuY2xlYXJQbGF5ZXJCb2FyZCgpO1xyXG4gIGdhbWUuYWRkUXVldWVTaGlwcygpO1xyXG4gIGdhbWVwbGF5Vmlldy5oaWRlUGxheUJ1dHRvbigpO1xyXG4gIGdhbWVwbGF5Vmlldy5yZW5kZXJHYW1lYm9hcmRSYW5kb20odXNlci5nZXRQbGF5ZXJCb2FyZCgpKTtcclxuICBnYW1lcGxheVZpZXcucmVuZGVyU2hpcFBpY2soZ2FtZS5nZXRTaGlwUGljaygpKTtcclxufTtcclxuXHJcbmNvbnN0IGFkZFNoaXBQb3NpdGlvblJhbmRvbSA9ICgpID0+IHtcclxuICBjb25zdCB1c2VyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XHJcblxyXG4gIHVzZXIuYWRkUmFuZG9tU2hpcHNQb3NpdGlvbigpO1xyXG5cclxuICBnYW1lcGxheVZpZXcucmVuZGVyR2FtZWJvYXJkUmFuZG9tKHVzZXIuZ2V0UGxheWVyQm9hcmQoKSk7XHJcbiAgaWYgKCFnYW1lLmVtcHR5UXVldWUoKSkge1xyXG4gICAgZ2FtZS5jbGVhclF1ZXVlU2hpcCgpO1xyXG4gICAgZ2FtZXBsYXlWaWV3LmhpZGVTaGlwUGljaygpO1xyXG4gICAgZ2FtZXBsYXlWaWV3LnNob3dQbGF5QnV0dG9uKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgYWRkU2hpcFBvc2l0aW9uID0gKGRhdGEpID0+IHtcclxuICBjb25zdCB7IHBvc0EsIHBvc0IgfSA9IGRhdGE7XHJcbiAgY29uc3QgdXNlciA9IGdhbWUuZ2V0Q3VycmVudFBsYXllcigpO1xyXG4gIGxldCBzaGlwID0gZ2FtZS5nZXRRdWV1ZVNoaXAoKTtcclxuXHJcbiAgY29uc3Qgb25Cb2FyZCA9IHVzZXIuYWRkU2hpcE9uUGxheWVyR2FtZWJvYXJkKHBvc0EsIHBvc0IsIHNoaXApO1xyXG5cclxuICBpZiAoIW9uQm9hcmQpIHJldHVybjtcclxuXHJcbiAgZ2FtZXBsYXlWaWV3LnJlbmRlckdhbWVib2FyZFNoaXAoZGF0YSwgc2hpcCk7XHJcbiAgZ2FtZS5kZXF1ZVNoaXAoKTtcclxuICBnYW1lcGxheVZpZXcucmVuZGVyU2hpcFBpY2soZ2FtZS5nZXRTaGlwUGljaygpKTtcclxufTtcclxuXHJcbmNvbnN0IGNoYW5nZVNoaXBEaXJlY3Rpb24gPSAoKSA9PiB7XHJcbiAgZ2FtZS5jaGFuZ2VHYW1lYm9hcmREaXJlY3Rpb24oKTtcclxuICBnYW1lcGxheVZpZXcucmVuZGVyU2hpcFBpY2soZ2FtZS5nZXRTaGlwUGljaygpKTtcclxufTtcclxuXHJcbmNvbnN0IHBsYXlDb21wdXRlclR1cm4gPSAoKSA9PiB7XHJcbiAgLy8gcmVtZW1iZXIgbm93IHRoYXQgcGxheWVycyBhcmUgc3dpdGNoZWRcclxuICAvLyBub3cgY3VycmVudCBwbGF5ZXIgaXMgQ29tcHV0ZXIgcGxheWVyICEhISFcclxuICAvLyBub3cgZW5lbXkgaXMgdXNlciBwbGF5ZXIgISEhXHJcbiAgY29uc3QgY29tcHV0ZXIgPSBnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKTtcclxuICBjb25zdCByYW5kb21Qb3NpdGlvbiA9IGNvbXB1dGVyLmdldEVuZW15UG9zaXRpb25Cb2FyZCgpO1xyXG4gIGF0dGFja0dhbWVib2FyZChyYW5kb21Qb3NpdGlvbik7XHJcbn07XHJcblxyXG4vLyBmdW5jdGlvbiBzaG93IG1vZGFsIHdpbmRvdyB3aGVuIHBsYXllciBzdW5rIGFsbCBzaGlwc1xyXG5jb25zdCBlbmRHYW1lID0gYXN5bmMgKCkgPT4ge1xyXG4gIGdhbWVwbGF5Vmlldy5yZW1vdmVDbGlja0NvbXB1dGVyR2FtZWJvYXJkKHBsYXlHYW1lKTtcclxuICBtb2RhbFZpZXcucmVuZGVyR2FtZVJlc3VsdChnYW1lLmdldEN1cnJlbnROYW1lKCkpO1xyXG5cclxuICBnYW1lcGxheVZpZXcuY2xlYXJQbGF5ZXJUdXJuKCk7XHJcbiAgbW9kYWxWaWV3LnRvZ2dsZU1vZGFsKCk7XHJcbiAgYXdhaXQgc2xlZXAoMC41KTtcclxuICBtb2RhbFZpZXcuYW5pbWF0ZU1vZGFsKCk7XHJcbn07XHJcblxyXG4vLyBmdW5jdGlvbiB1cGRhdGUgZ2FtZSBzdGF0ZVxyXG5jb25zdCB1cGRhdGVHYW1lID0gYXN5bmMgKHNoaXApID0+IHtcclxuICAvLyBjaGVjayBpZiBzaGlwIGV4aXN0cyBvbiBjZWxsLFxyXG4gIGlmICghc2hpcCkge1xyXG4gICAgZ2FtZS5zd2l0Y2hQbGF5ZXJzKCk7XHJcbiAgICBnYW1lcGxheVZpZXcuaGlkZVBsYXllclR1cm4oKTtcclxuICAgIGdhbWVwbGF5Vmlldy5zd2l0Y2hHYW1lUGFuZWwoKTtcclxuICAgIGF3YWl0IHNsZWVwKDAuMTUpO1xyXG4gICAgZ2FtZXBsYXlWaWV3LmNoYW5nZVBsYXllclR1cm4oZ2FtZS5nZXRDdXJyZW50TmFtZSgpKTtcclxuXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb25zdCBjdXJyZW50UGxheWVyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XHJcbiAgY29uc3QgZW5lbXlQbGF5ZXIgPSBnYW1lLmdldEVuZW15UGxheWVyKCk7XHJcblxyXG4gIGlmICghZ2FtZS51c2VyUGxheWluZygpKSB7XHJcbiAgICAvLyB3ZSBzZXQgdHJ1ZSByYW5kb20gcG9zaXRpb24gYXJvdW5kIHRhcmdldCBzaGlwXHJcbiAgICBjdXJyZW50UGxheWVyLnNlbGVjdFNoaXBIaXR0aW5nKCk7XHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayBpZiB0YXJnZXRTaGlwIGlzIGZ1bGwgU3Vua1xyXG4gIGlmIChzaGlwLmdldFN1bmsoKSkge1xyXG4gICAgLy8gY2hlY2sgYWN0aW9uIGZvciBjb21wdXRlciBwbGF5XHJcbiAgICBpZiAoIWdhbWUudXNlclBsYXlpbmcoKSkge1xyXG4gICAgICBjdXJyZW50UGxheWVyLmRlc2VsZWN0U2hpcEhpdHRpbmcoKTsgLy9hZnRlciB1bmNoZWNraW5nIHRoZXNlIHNldHRpbmdzIHdlIGRyYXcgcmFuZG9tIHBvc2l0aW9uIG9uIGJvYXJkXHJcbiAgICAgIGN1cnJlbnRQbGF5ZXIuY2xlYXJQb3RlbnRpYWxTaGlwUG9zaXRpb25zKCk7IC8vIHdlIG5vdCBuZWVkIHBvdGVudGlhbCBwb3NpdGlvbiBhZnRlciBzdW5rIHNoaXAgYXJvdW5kIHNoaXAgZmllbGRzIG9uIGVuZW15IGJvYXJkXHJcbiAgICAgIC8vIHdlIHJlbW92ZSBhbHNvIHJlc2VydmVkIHBvc2l0aW9ucyBhcm91bmQgc2hpcCBmaWVsZHMgZnJvbSBwb3RlbnRpYWwgY29tcHV0ZXIgcG9zaXRpb25zXHJcbiAgICAgIGN1cnJlbnRQbGF5ZXIuY2xlYXJSZXNlcnZlZFBvc2l0aW9ucyhzaGlwLmdldFJlc2VydmVkUG9zaXRpb25zKCkpO1xyXG4gICAgfVxyXG4gICAgZW5lbXlQbGF5ZXIuaW5jcmVhc2VTdW5rZW5TaGlwcygpO1xyXG4gICAgLy8gc2V0IHJlc2VydmVkIGNlbGxzIGFzIG1hcmtlZFxyXG4gICAgZW5lbXlQbGF5ZXIuYWRkUmVzZXJ2ZWRTaGlwUG9zaXRpb25zKHNoaXAuZ2V0UmVzZXJ2ZWRQb3NpdGlvbnMoKSk7XHJcblxyXG4gICAgLy8gcmVuZGVyIHJlc2VydmVkIGNlbGxzIG9uIGdhbWVib2FyZCBlbGVtZW50XHJcbiAgICBnYW1lcGxheVZpZXcucmVuZGVyUmVzZXJ2ZWRQb3NpdGlvbnMoXHJcbiAgICAgIGVuZW15UGxheWVyLmdldFR5cGUoKSxcclxuICAgICAgc2hpcC5nZXRSZXNlcnZlZFBvc2l0aW9ucygpXHJcbiAgICApO1xyXG5cclxuICAgIC8vIHJlbmRlciBzdW5rIHNoaXAgb24gc2hpcCBsaXN0IGVsZW1lbnRcclxuICAgIGdhbWVwbGF5Vmlldy5yZW5kZXJTdW5rU2hpcChzaGlwLmdldElEKCkpO1xyXG4gICAgLy8gZ2FtZXBsYXlWaWV3LnJlbmRlclN1bmtTaGlwKGVuZW15UGxheWVyKTtcclxuICB9XHJcbiAgLy8gY2hlY2sgaWYgYWxsIGVuZW15IHNoaXBzIGFyZSBzdW5rZW5cclxuICBpZiAoZW5lbXlQbGF5ZXIuYWxsU3Vua2VuU2hpcHMoKSkge1xyXG4gICAgZW5kR2FtZSgpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGF0dGFja0dhbWVib2FyZCA9IGFzeW5jIChwb3NpdGlvbikgPT4ge1xyXG4gIC8vIGNvbnN0IHBvc2l0aW9uID0gZ2FtZXBsYXlWaWV3LmdldENvbXB1dGVyQm9hcmRQb3NpdGlvbihldmVudCk7XHJcbiAgLy8gaWYgKCFwb3NpdGlvbikgcmV0dXJuO1xyXG5cclxuICBpZiAoZ2FtZS5nZXRUaW1lcigpKSByZXR1cm47XHJcblxyXG4gIC8vIGdldCBjdXJyZW50IGFuZCBlbmVteSBwbGF5ZXJzXHJcbiAgY29uc3QgY3VycmVudFBsYXllciA9IGdhbWUuZ2V0Q3VycmVudFBsYXllcigpO1xyXG4gIGNvbnN0IGVuZW15UGxheWVyID0gZ2FtZS5nZXRFbmVteVBsYXllcigpO1xyXG5cclxuICAvLyBnZXQgcG9zaXRpb24gb2YgZW5lbXkgY2VsbCBmcm9tIGdhbWVib2FyZDtcclxuICBjb25zdCBlbmVteUNlbGwgPSBjdXJyZW50UGxheWVyLmF0dGFja0VuZW15R2FtZWJvYXJkKHBvc2l0aW9uLCBlbmVteVBsYXllcik7XHJcblxyXG4gIC8vIGNoZWNrIGlmIGVuZW15Q2VsbCBpcyBtYXJrZWQgb3IgaGl0XHJcbiAgaWYgKCFlbmVteUNlbGwpIHJldHVybjtcclxuXHJcbiAgLy8gc2hpcCBvYmplY3QgZnJvbSBib2FyZCBhcnJheVxyXG4gIGNvbnN0IHNoaXAgPSBlbmVteUNlbGwuc2hpcENlbGw7XHJcblxyXG4gIC8vIHJlbmRlciBtYXJrIG9uIHRhcmdldCBjZWxsXHJcbiAgZ2FtZXBsYXlWaWV3LnJlbmRlck1hcmtlZENlbGwocG9zaXRpb24sIHNoaXAsIGVuZW15UGxheWVyLmdldFR5cGUoKSk7XHJcblxyXG4gIC8vIHVwZGF0ZSBnYW1lIHN0YXRlXHJcbiAgdXBkYXRlR2FtZShzaGlwKTtcclxuICAvLyBzdG9wIHR1cm4gd2hlbiBjdXJyZW50IHBsYXllciBpcyB1c2VyIG9yIGdhbWUgaXMgb3ZlclxyXG4gIGlmIChnYW1lLnVzZXJQbGF5aW5nKCkgfHwgZ2FtZS5zdG9wUGxheWluZygpKSByZXR1cm47XHJcbiAgZ2FtZS5zZXRUaW1lcihwbGF5Q29tcHV0ZXJUdXJuKTtcclxufTtcclxuXHJcbi8vIGZ1bmN0aW9uIG1ha2UgZ2FtZXBsYXkgYmV0d2VlbiB1c2VyIGFuZCBjb21wdXRlclxyXG5jb25zdCBwbGF5R2FtZSA9IChldmVudCkgPT4ge1xyXG4gIGlmIChnYW1lLmdldFRpbWVyKCkgfHwgZ2FtZS5nZXREZWxheSgpIHx8ICFnYW1lLnVzZXJQbGF5aW5nKCkpIHJldHVybjtcclxuICBjb25zdCBwb3NpdGlvbiA9IGdhbWVwbGF5Vmlldy5nZXRDb21wdXRlckJvYXJkUG9zaXRpb24oZXZlbnQpO1xyXG4gIGlmICghcG9zaXRpb24pIHJldHVybjtcclxuICBhdHRhY2tHYW1lYm9hcmQocG9zaXRpb24pO1xyXG59O1xyXG5cclxuY29uc3QgcnVuR2FtZSA9ICgpID0+IHtcclxuICBjb25zdCB1c2VyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XHJcbiAgY29uc3QgY29tcHV0ZXIgPSBnYW1lLmdldEVuZW15UGxheWVyKCk7XHJcbiAgY29tcHV0ZXIuYWRkUmFuZG9tU2hpcHNQb3NpdGlvbigpO1xyXG4gIGNvbXB1dGVyLmFkZEdhbWVib2FyZFBvc2l0aW9ucyh1c2VyLmdldFBsYXllckJvYXJkKCkpO1xyXG5cclxuICBnYW1lLmNsZWFyUXVldWVTaGlwKCk7XHJcbiAgZ2FtZXBsYXlWaWV3LmhpZGVQbGF5QnV0dG9uKCk7XHJcbiAgZ2FtZXBsYXlWaWV3LnJlbmRlclBsYXllclR1cm4odXNlci5nZXROYW1lKCkpO1xyXG4gIGdhbWVwbGF5Vmlldy5zd2l0Y2hHYW1lUGFuZWwoKTtcclxuICBnYW1lcGxheVZpZXcub25DbGlja0NvbXB1dGVyR2FtZWJvYXJkKHBsYXlHYW1lKTtcclxufTtcclxuXHJcbmNvbnN0IHN0YXJ0R2FtZSA9IChuYW1lKSA9PiB7XHJcbiAgaWYgKCFuYW1lKSB7XHJcbiAgICBtZW51Vmlldy5zaG93RXJyb3IoKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY29uc3QgcGxheWVycyA9IGdhbWUuZ2V0UGxheWVycygpO1xyXG4gIGNvbnN0IHBsYXllckdhbWVib2FyZCA9IGdhbWUuZ2V0Q3VycmVudFBsYXllckdhbWVib2FyZCgpO1xyXG4gIGNvbnN0IHNoaXBQaWNrID0gZ2FtZS5nZXRTaGlwUGljaygpO1xyXG5cclxuICBnYW1lLnNldFVzZXJQbGF5ZXJOYW1lKG5hbWUpO1xyXG5cclxuICBnYW1lcGxheVZpZXcucmVuZGVyR2FtZXBsYXkocGxheWVycyk7XHJcbiAgZ2FtZXBsYXlWaWV3LnJlbmRlclNoaXBQaWNrKHNoaXBQaWNrKTtcclxuXHJcbiAgZ2FtZXBsYXlWaWV3Lm9uQ2xpY2tTaGlwRWwoY2hhbmdlU2hpcERpcmVjdGlvbik7XHJcbiAgZ2FtZXBsYXlWaWV3Lm9uRHJhZ1NoaXBFbChwbGF5ZXJHYW1lYm9hcmQpO1xyXG4gIGdhbWVwbGF5Vmlldy5vbkRyb3BTaGlwRWwoYWRkU2hpcFBvc2l0aW9uKTtcclxuXHJcbiAgZ2FtZXBsYXlWaWV3Lm9uQ2xpY2tSYW5kb21CdG4oYWRkU2hpcFBvc2l0aW9uUmFuZG9tKTtcclxuICBnYW1lcGxheVZpZXcub25DbGlja1Jlc2V0QnRuKHJlc2V0R2FtZWJvYXJkKTtcclxuICBnYW1lcGxheVZpZXcub25DbGlja1BsYXlCdG4ocnVuR2FtZSk7XHJcbiAgbWVudVZpZXcuaGlkZVN0YXJ0TWVudSgpO1xyXG59O1xyXG5cclxuY29uc3QgcmVzdGFydEdhbWUgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgZ2FtZS5yZXN0YXJ0R2FtZSgpO1xyXG5cclxuICBnYW1lcGxheVZpZXcucmVuZGVyR2FtZXBsYXkoZ2FtZS5nZXRQbGF5ZXJzKCkpO1xyXG4gIGdhbWVwbGF5Vmlldy5yZW5kZXJTaGlwUGljayhnYW1lLmdldFNoaXBQaWNrKCkpO1xyXG5cclxuICBtb2RhbFZpZXcuYW5pbWF0ZU1vZGFsKCk7XHJcbiAgYXdhaXQgc2xlZXAoMC41KTtcclxuICBtb2RhbFZpZXcudG9nZ2xlTW9kYWwoKTtcclxufTtcclxuXHJcbmNvbnN0IGluaXQgPSAoKSA9PiB7XHJcbiAgbWVudVZpZXcub25DbGlja1N0YXJ0QnV0dG9uKHN0YXJ0R2FtZSk7XHJcbiAgbW9kYWxWaWV3Lm9uQ2xpY2tSZXN0YXJ0QnRuKHJlc3RhcnRHYW1lKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluaXQ7XHJcbiIsImltcG9ydCB7IEhPUklaT05UQUwsIFZFUlRJQ0FMIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgeyBnZXRSYW5kb21OdW1iZXIgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvaGVscGVyc1wiO1xyXG5cclxuY2xhc3MgR2FtZWJvYXJkIHtcclxuICBzdGF0aWMgbWF4U2l6ZSA9IDEwO1xyXG4gIGJvYXJkID0gW107XHJcblxyXG4gIGRpcmVjdGlvbnMgPSBbSE9SSVpPTlRBTCwgVkVSVElDQUxdO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY3JlYXRlR2FtZWJvYXJkKCk7XHJcbiAgfVxyXG5cclxuICBnZXRHYW1lYm9hcmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5ib2FyZDtcclxuICB9XHJcblxyXG4gIGdldERpcmVjdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbnNbMF07XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VEaXJlY3Rpb24oKSB7XHJcbiAgICBjb25zdCBbZmlyc3QsIHNlY29uZF0gPSB0aGlzLmRpcmVjdGlvbnM7XHJcbiAgICB0aGlzLmRpcmVjdGlvbnMgPSBbc2Vjb25kLCBmaXJzdF07XHJcbiAgfVxyXG5cclxuICBjbGVhckdhbWVib2FyZCgpIHtcclxuICAgIHRoaXMuYm9hcmQubGVuZ3RoID0gMDtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUdhbWVib2FyZCgpIHtcclxuICAgIHRoaXMuY2xlYXJHYW1lYm9hcmQoKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgR2FtZWJvYXJkLm1heFNpemU7IGkrKykge1xyXG4gICAgICB0aGlzLmJvYXJkW2ldID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBHYW1lYm9hcmQubWF4U2l6ZTsgaSsrKSB7XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgR2FtZWJvYXJkLm1heFNpemU7IGorKykge1xyXG4gICAgICAgIHRoaXMuYm9hcmRbaV1bal0gPSB7IHNoaXBDZWxsOiBudWxsLCBtYXJrZWQ6IGZhbHNlLCByZXNlcnZlZDogZmFsc2UgfTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkU2hpcChwb3NBLCBwb3NCLCBzaGlwKSB7XHJcbiAgICBzaGlwLmNsZWFyUmVzZXJ2ZWRQb3NpdGlvbnMoKTtcclxuXHJcbiAgICBpZiAoXHJcbiAgICAgIHBvc0EgPCAwIHx8XHJcbiAgICAgIHBvc0EgPj0gR2FtZWJvYXJkLm1heFNpemUgfHxcclxuICAgICAgcG9zQiA8IDAgfHxcclxuICAgICAgcG9zQiA+PSBHYW1lYm9hcmQubWF4U2l6ZVxyXG4gICAgKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgLy8gY2hlY2sgaWYgYm9hcmRjZWxsIGlzIGhhcyBzaGlwIG9yIHJlc2VydmVkIHBsYWNlXHJcbiAgICBpZiAodGhpcy5ib2FyZFtwb3NBXVtwb3NCXS5zaGlwQ2VsbCB8fCB0aGlzLmJvYXJkW3Bvc0FdW3Bvc0JdLnJlc2VydmVkKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5nZXREaXJlY3Rpb24oKTtcclxuICAgIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwLmdldExlbmd0aCgpO1xyXG5cclxuICAgIGlmIChkaXJlY3Rpb24gPT09IEhPUklaT05UQUwpIHtcclxuICAgICAgLy8gY2hlY2sgaWYgd2UgY2FuIHNoaXAgbGVuZ2h0IGNhbiBiZSBwdXQgaW4gY3VycmVudCBjZWxsO1xyXG4gICAgICBpZiAoc2hpcExlbmd0aCArIHBvc0IgPiBHYW1lYm9hcmQubWF4U2l6ZSkgcmV0dXJuO1xyXG4gICAgICAvL2NoZWNrIGlmIG90aGVyIGNlbGxzIGZvciBzaGlwIGlzIGVtcHR5IG9yIHJlc2VydmVkXHJcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgeyBzaGlwQ2VsbCwgcmVzZXJ2ZWQgfSA9IHRoaXMuYm9hcmRbcG9zQV1bcG9zQiArIGldO1xyXG4gICAgICAgIGlmIChzaGlwQ2VsbCB8fCByZXNlcnZlZCkgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGZpbGwgYm9hcmQgcG9zaXRpb24gd2l0aCBzaGlwIGVsZW1lbnRzXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZFtwb3NBXVtwb3NCICsgaV0uc2hpcENlbGwgPSBzaGlwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBmaWxsIGJvYXJkIHdpdGggcmVzZXJ2ZWQgY2VsbHMgYXJvdW5kIHNoaXAgZWxlbWVudHNcclxuICAgICAgZm9yIChsZXQgaSA9IC0xOyBpIDw9IDE7IGkrKykge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuYm9hcmRbcG9zQSArIGldKTtcclxuICAgICAgICBpZiAoIXRoaXMuYm9hcmRbcG9zQSArIGldKSBjb250aW51ZTtcclxuICAgICAgICBmb3IgKGxldCBqID0gLTE7IGogPD0gc2hpcExlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmJvYXJkW3Bvc0EgKyBpXSk7XHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHBvc0IgKyBqIDwgMCB8fFxyXG4gICAgICAgICAgICBwb3NCICsgaiA+PSBHYW1lYm9hcmQubWF4U2l6ZSB8fFxyXG4gICAgICAgICAgICB0aGlzLmJvYXJkW3Bvc0EgKyBpXVtwb3NCICsgal0uc2hpcENlbGxcclxuICAgICAgICAgIClcclxuICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgdGhpcy5ib2FyZFtwb3NBICsgaV1bcG9zQiArIGpdLnJlc2VydmVkID0gdHJ1ZTtcclxuICAgICAgICAgIHNoaXAuYWRkUmVzZXJ2ZWRQb3NpdGlvbnMoeyBwb3NBOiBwb3NBICsgaSwgcG9zQjogcG9zQiArIGogfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gVkVSVElDQUwpIHtcclxuICAgICAgaWYgKHNoaXBMZW5ndGggKyBwb3NBID4gR2FtZWJvYXJkLm1heFNpemUpIHJldHVybjtcclxuXHJcbiAgICAgIC8vIGNoZWNrIGlmIGNlbGwgaXMgZW1wdHkgb3IgcmVzZXJ2ZWQgZm9yIHNoaXAgbGVuZ3RoXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgeyBzaGlwQ2VsbCwgcmVzZXJ2ZWQgfSA9IHRoaXMuYm9hcmRbcG9zQSArIGldW3Bvc0JdO1xyXG5cclxuICAgICAgICBpZiAoc2hpcENlbGwgfHwgcmVzZXJ2ZWQpIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICAvLyBmaWxsIGJvYXJkIHBvc2l0aW9uIHdpdGggc2hpcCBlbGVtZW50c1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRoaXMuYm9hcmRbcG9zQSArIGldW3Bvc0JdLnNoaXBDZWxsID0gc2hpcDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gZmlsbCBib2FyZCB3aXRoIHJlc2VydmVkIGNlbGxzIGFyb3VuZCBzaGlwIGVsZW1lbnRzXHJcbiAgICAgIGZvciAobGV0IGkgPSAtMTsgaSA8PSBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoIXRoaXMuYm9hcmRbcG9zQSArIGldKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaiA9IC0xOyBqIDw9IDE7IGorKykge1xyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBwb3NCICsgaiA8IDAgfHxcclxuICAgICAgICAgICAgcG9zQiArIGogPj0gR2FtZWJvYXJkLm1heFNpemUgfHxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NBICsgaV1bcG9zQiArIGpdLnNoaXBDZWxsXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgdGhpcy5ib2FyZFtwb3NBICsgaV1bcG9zQiArIGpdLnJlc2VydmVkID0gdHJ1ZTtcclxuICAgICAgICAgIHNoaXAuYWRkUmVzZXJ2ZWRQb3NpdGlvbnMoeyBwb3NBOiBwb3NBICsgaSwgcG9zQjogcG9zQiArIGogfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNoaXA7XHJcbiAgfVxyXG5cclxuICBhZGRSYW5kb21TaGlwcyhzaGlwcykge1xyXG4gICAgdGhpcy5jcmVhdGVHYW1lYm9hcmQoKTtcclxuXHJcbiAgICB3aGlsZSAoc2hpcHMubGVuZ3RoID4gMCkge1xyXG4gICAgICBsZXQgcG9zQSA9IGdldFJhbmRvbU51bWJlcihHYW1lYm9hcmQubWF4U2l6ZSk7XHJcbiAgICAgIGxldCBwb3NCID0gZ2V0UmFuZG9tTnVtYmVyKEdhbWVib2FyZC5tYXhTaXplKTtcclxuXHJcbiAgICAgIGxldCBkaXJlY3Rpb24gPSBnZXRSYW5kb21OdW1iZXIodGhpcy5kaXJlY3Rpb25zLmxlbmd0aCk7XHJcbiAgICAgIC8vIGxldCBkaXJlY3Rpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmRpcmVjdGlvbnMubGVuZ3RoKTtcclxuXHJcbiAgICAgIC8vLyA/Pz8/Pz9cclxuICAgICAgLy8vLyBOSUUgV0lFTSBDWlkgRFpJQcWBQVxyXG4gICAgICAvLy8vLy9cclxuICAgICAgaWYgKGRpcmVjdGlvbikge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlRGlyZWN0aW9uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IFtmaXJzdCwgLi4ub3RoZXJzXSA9IHNoaXBzO1xyXG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFkZFNoaXAocG9zQSwgcG9zQiwgZmlyc3QpO1xyXG4gICAgICBpZiAocmVzdWx0KSBzaGlwcyA9IG90aGVycztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5ib2FyZDtcclxuICB9XHJcblxyXG4gIHJlY2VpdmVBdHRhY2socG9zQSwgcG9zQikge1xyXG4gICAgY29uc3QgeyBtYXJrZWQsIHNoaXBDZWxsIH0gPSB0aGlzLmJvYXJkW3Bvc0FdW3Bvc0JdO1xyXG5cclxuICAgIC8vY2hlY2sgaWYgZWxlbWVudCBpcyBtYXJrZWRcclxuICAgIGlmIChtYXJrZWQpIHJldHVybjtcclxuXHJcbiAgICAvLyBzZXQgbWFya2VkIHByb3BlcnR5IHRvIHRydWU7XHJcbiAgICB0aGlzLmJvYXJkW3Bvc0FdW3Bvc0JdLm1hcmtlZCA9IHRydWU7XHJcblxyXG4gICAgaWYgKHNoaXBDZWxsKSBzaGlwQ2VsbC5yZWNlaXZlSGl0KCk7XHJcblxyXG4gICAgLy8gcmV0dXJuIG9iamVjdCBmcm9tIGJvYXJkXHJcbiAgICByZXR1cm4gdGhpcy5ib2FyZFtwb3NBXVtwb3NCXTtcclxuICB9XHJcblxyXG4gIGFkZFJlc2VydmVkU2hpcFBvc2l0aW9ucyhyZXNlcnZlZFBvc2l0aW9ucykge1xyXG4gICAgcmVzZXJ2ZWRQb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcclxuICAgICAgY29uc3QgeyBwb3NBLCBwb3NCIH0gPSBwb3NpdGlvbjtcclxuICAgICAgaWYgKCF0aGlzLmJvYXJkW3Bvc0FdW3Bvc0JdLm1hcmtlZCkgdGhpcy5ib2FyZFtwb3NBXVtwb3NCXS5tYXJrZWQgPSB0cnVlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7XHJcbiIsImltcG9ydCB7IFRJTUVfREVMQVksIFRJTUVfT1VUIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gXCIuLi8uLi91dGlscy9oZWxwZXJzXCI7XHJcbmltcG9ydCBDb21wdXRlciBmcm9tIFwiLi9wbGF5ZXJzL2NvbXB1dGVyXCI7XHJcbmltcG9ydCBVc2VyIGZyb20gXCIuL3BsYXllcnMvdXNlclwiO1xyXG5pbXBvcnQgeyBRdWV1ZSB9IGZyb20gXCIuL3F1ZXVlL3F1ZXVlXCI7XHJcblxyXG5jbGFzcyBHYW1lIHtcclxuICBzaGlwUXVldWUgPSBuZXcgUXVldWUoKTtcclxuICBjdXJyZW50UGxheWVyID0gbmV3IFVzZXIoKTtcclxuICBlbmVteVBsYXllciA9IG5ldyBDb21wdXRlcigpO1xyXG4gIHRpbWVyO1xyXG4gIGRlbGF5O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuYWRkUXVldWVTaGlwcygpO1xyXG4gIH1cclxuXHJcbiAgc2V0VXNlclBsYXllck5hbWUobmFtZSkge1xyXG4gICAgdGhpcy5jdXJyZW50UGxheWVyLnNldE5hbWUobmFtZSk7XHJcbiAgfVxyXG5cclxuICBnZXRDdXJyZW50UGxheWVyR2FtZWJvYXJkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFBsYXllci5nZXRQbGF5ZXJCb2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3VycmVudFBsYXllcigpIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRQbGF5ZXI7XHJcbiAgfVxyXG5cclxuICBnZXRFbmVteVBsYXllcigpIHtcclxuICAgIHJldHVybiB0aGlzLmVuZW15UGxheWVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3VycmVudE5hbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50UGxheWVyLmdldE5hbWUoKTtcclxuICB9XHJcblxyXG4gIGdldFBsYXllcnMoKSB7XHJcbiAgICByZXR1cm4gW3RoaXMuY3VycmVudFBsYXllciwgdGhpcy5lbmVteVBsYXllcl07XHJcbiAgfVxyXG5cclxuICBnZXRHYW1lYm9hcmREaXJlY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50UGxheWVyLmdldEN1cnJlbnRCb2FyZERpcmVjdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgdXNlclBsYXlpbmcoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50UGxheWVyIGluc3RhbmNlb2YgVXNlcjtcclxuICB9XHJcblxyXG4gIHN3aXRjaFBsYXllcnMoKSB7XHJcbiAgICBjb25zdCB0ZW1wID0gdGhpcy5jdXJyZW50UGxheWVyO1xyXG4gICAgdGhpcy5jdXJyZW50UGxheWVyID0gdGhpcy5lbmVteVBsYXllcjtcclxuICAgIHRoaXMuZW5lbXlQbGF5ZXIgPSB0ZW1wO1xyXG4gIH1cclxuXHJcbiAgcmVzdGFydEdhbWUoKSB7XHJcbiAgICBpZiAoIXRoaXMudXNlclBsYXlpbmcoKSkge1xyXG4gICAgICB0aGlzLnN3aXRjaFBsYXllcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBwbGF5ZXIgb2YgdGhpcy5nZXRQbGF5ZXJzKCkpIHtcclxuICAgICAgcGxheWVyLmNsZWFyUGxheWVyQm9hcmQoKTtcclxuICAgICAgcGxheWVyLnJlc2V0U2hpcHMoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFkZFF1ZXVlU2hpcHMoKTtcclxuICB9XHJcblxyXG4gIGNoYW5nZUdhbWVib2FyZERpcmVjdGlvbigpIHtcclxuICAgIHRoaXMuY3VycmVudFBsYXllci5jaGFuZ2VDdXJyZW50Qm9hcmREaXJlY3Rpb24oKTtcclxuICB9XHJcblxyXG4gIGdldFNoaXBQaWNrKCkge1xyXG4gICAgY29uc3Qgc2hpcCA9IHRoaXMuc2hpcFF1ZXVlLnBlZWsoKTtcclxuICAgIGNvbnN0IGN1cnJlbnRTaGlwTGVmdCA9IHRoaXMuZ2V0Q3VycmVudFNoaXBMZWZ0KCk7XHJcbiAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLmdldEdhbWVib2FyZERpcmVjdGlvbigpO1xyXG5cclxuICAgIHJldHVybiB7IHNoaXAsIGN1cnJlbnRTaGlwTGVmdCwgZGlyZWN0aW9uIH07XHJcbiAgfVxyXG5cclxuICBnZXRRdWV1ZVNoaXAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zaGlwUXVldWUucGVlaygpO1xyXG4gIH1cclxuXHJcbiAgZGVxdWVTaGlwKCkge1xyXG4gICAgdGhpcy5zaGlwUXVldWUuZGVxdWV1ZSgpO1xyXG4gIH1cclxuXHJcbiAgZW1wdHlRdWV1ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLnNoaXBRdWV1ZS5pc0VtcHR5KCk7XHJcbiAgfVxyXG5cclxuICBjbGVhclF1ZXVlU2hpcCgpIHtcclxuICAgIHRoaXMuc2hpcFF1ZXVlLmNsZWFyUXVldWUoKTtcclxuICB9XHJcblxyXG4gIGFkZFF1ZXVlU2hpcHMoKSB7XHJcbiAgICBjb25zdCBzaGlwcyA9IHRoaXMuY3VycmVudFBsYXllci5nZXRTaGlwcygpO1xyXG4gICAgdGhpcy5zaGlwUXVldWUuYWRkRWxlbWVudHMoc2hpcHMpO1xyXG4gIH1cclxuXHJcbiAgc2FtZUxlbmd0aFNoaXBzKGN1cnJlbnQpIHtcclxuICAgIGNvbnN0IHBlZWtMZW5ndGggPSB0aGlzLmdldFF1ZXVlU2hpcCgpLmdldExlbmd0aCgpO1xyXG5cclxuICAgIGNvbnN0IGNvbmRpdGlvbiA9IHBlZWtMZW5ndGggIT09IGN1cnJlbnQuZ2V0TGVuZ3RoKCk7XHJcblxyXG4gICAgcmV0dXJuIGNvbmRpdGlvbjtcclxuICB9XHJcblxyXG4gIGdldEN1cnJlbnRTaGlwTGVmdCgpIHtcclxuICAgIGlmICghdGhpcy51c2VyUGxheWluZygpKSByZXR1cm47XHJcbiAgICBjb25zdCBjYiA9IHRoaXMuc2FtZUxlbmd0aFNoaXBzLmJpbmQodGhpcyk7XHJcbiAgICByZXR1cm4gdGhpcy5zaGlwUXVldWUuY291bnRFbGVtZW50KGNiKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNldFRpbWVyKGNiKSB7XHJcbiAgICB0aGlzLnRpbWVyID0gdHJ1ZTtcclxuXHJcbiAgICBhd2FpdCBzbGVlcChUSU1FX09VVCk7XHJcbiAgICB0aGlzLnRpbWVyID0gZmFsc2U7XHJcbiAgICBjYigpO1xyXG4gICAgdGhpcy5kZWxheSA9IHRydWU7XHJcbiAgICBhd2FpdCBzbGVlcChUSU1FX0RFTEFZKTtcclxuICAgIHRoaXMuZGVsYXkgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8vIHNldFRpbWVyKGNiKSB7XHJcbiAgLy8gICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgLy8gICAgIHRoaXMudGltZXIgPSBudWxsO1xyXG4gIC8vICAgICBjb25zb2xlLmxvZyhcInRpbWVyIGlzIG92ZXJcIik7XHJcbiAgLy8gICAgIGNiKCk7XHJcbiAgLy8gICAgIHRoaXMuZGVsYXkgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAvLyAgICAgICB0aGlzLmRlbGF5ID0gbnVsbDtcclxuICAvLyAgICAgICBjb25zb2xlLmxvZyhcImRlbGF5IGlzIG92ZXJcIik7XHJcbiAgLy8gICAgIH0sIDM1MCk7XHJcbiAgLy8gICB9LCBUSU1FX09VVCk7XHJcbiAgLy8gfVxyXG5cclxuICBnZXRUaW1lcigpIHtcclxuICAgIHJldHVybiB0aGlzLnRpbWVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0RGVsYXkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kZWxheTtcclxuICB9XHJcblxyXG4gIHN0b3BQbGF5aW5nKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgdGhpcy5lbmVteVBsYXllci5hbGxTdW5rZW5TaGlwcygpIHx8IHRoaXMuY3VycmVudFBsYXllci5hbGxTdW5rZW5TaGlwcygpXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcclxuIiwiaW1wb3J0IHsgYmluYXJ5U2VhcmNoLCBnZXRSYW5kb21OdW1iZXIgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvaGVscGVyc1wiO1xyXG5pbXBvcnQgU2hpcFBvc2l0aW9uIGZyb20gXCIuLi9zaGlwUG9zaXRpb24vc2hpcFBvc2l0aW9uXCI7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyXCI7XHJcblxyXG5jbGFzcyBDb21wdXRlciBleHRlbmRzIFBsYXllciB7XHJcbiAgYXZhaWxhYmxlUG9zaXRpb25zID0gW107XHJcbiAgc2hpcEhpdDtcclxuXHJcbiAgcG9zaXRpb247XHJcbiAgcG90ZW50aWFsU2hpcFBvc2l0aW9ucyA9IG5ldyBTaGlwUG9zaXRpb24oKTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5zaGlwSGl0ID0gZmFsc2U7XHJcbiAgICB0aGlzLm5hbWUgPSBcImNvbXB1dGVyXCI7XHJcbiAgfVxyXG5cclxuICBnZXRUeXBlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubmFtZTtcclxuICB9XHJcblxyXG4gIGdldE5hbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xyXG4gIH1cclxuXHJcbiAgc2VsZWN0U2hpcEhpdHRpbmcoKSB7XHJcbiAgICB0aGlzLnNoaXBIaXQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZGVzZWxlY3RTaGlwSGl0dGluZygpIHtcclxuICAgIHRoaXMuc2hpcEhpdCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLy8gbWV0aG9kIGFkZCBhbGwgcG9zc2libGUgYm9hcmQgcG9zaXRpb25zXHJcbiAgLy8gdG8gYXZhaWxhYmxlUG9zaXRpb25zIGFycmF5XHJcbiAgYWRkR2FtZWJvYXJkUG9zaXRpb25zKGJvYXJkKSB7XHJcbiAgICAvLyBzZXQgdXNlciBib2FyZCBmb3IgY29tcHV0ZXIgdG8ga25vdyB3aGF0IG1vdmVzIGl0IGNhbiBkb1xyXG4gICAgLy8gYXJvdW5kIGhpdCBzaGlwIGNlbGxcclxuICAgIHRoaXMucG90ZW50aWFsU2hpcFBvc2l0aW9ucy5zZXRCb2FyZChib2FyZCk7XHJcblxyXG4gICAgaWYgKHRoaXMuYXZhaWxhYmxlUG9zaXRpb25zLmxlbmd0aCAhPT0gMClcclxuICAgICAgdGhpcy5hdmFpbGFibGVQb3NpdGlvbnMubGVuZ3RoID0gMDtcclxuICAgIC8vIGNvbnN0IGJvYXJkID0gdGhpcy5nZXRQbGF5ZXJCb2FyZCgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBib2FyZFtpXS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlUG9zaXRpb25zLnB1c2goeyBwb3NBOiBpLCBwb3NCOiBqIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBtZXRob2QgcmV0dXJucyBwb3RlbnRpYWwgYm9hcmQgc2hpcCBwb3NpdGlvbiBmb3IgY29tcHV0ZXJcclxuICBnZXRFbmVteVBvc2l0aW9uQm9hcmQoKSB7XHJcbiAgICAvLyBpZiAgc2hpcCB3YXMgaGl0LCBnZXQgb25seSBwb3NpdGlvbnNcclxuICAgIC8vIGFyb3VuZCB0aGF0IHNoaXAgaGl0IHBvc2l0aW9uXHJcbiAgICBpZiAodGhpcy5zaGlwSGl0KSB7XHJcbiAgICAgIGNvbnN0IG5leHRQb3NpdGlvbiA9IHRoaXMucG90ZW50aWFsU2hpcFBvc2l0aW9ucy5nZXRBZGphY2VudEhpdFBvc2l0aW9ucyhcclxuICAgICAgICB0aGlzLnBvc2l0aW9uXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMucG9zaXRpb24gPSBuZXh0UG9zaXRpb247IC8vIGFzc2lnbiB0aGlzICBwb3NpdGlvbiB0byBwcm9wZXJ0eVxyXG5cclxuICAgICAgLy8gc2VhcmNoIGNvcnJlY3QgaW5kZXggb2YgYXZhaWxhYmxlUG9zaXRpb25zIGFycmF5XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gYmluYXJ5U2VhcmNoKHRoaXMuYXZhaWxhYmxlUG9zaXRpb25zLCB0aGlzLnBvc2l0aW9uKTtcclxuICAgICAgLy8gbmV4dCByZW1vdmUgdGhlIHBvc2l0aW9uIGZyb20gYXZhaWxhYmVQb3NpdGlvbiBhcnJheVxyXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB0aGlzLmF2YWlsYWJsZVBvc2l0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5hdmFpbGFibGVQb3NpdGlvbnMucG9wKCk7XHJcblxyXG4gICAgICAgIHRoaXMucG90ZW50aWFsU2hpcFBvc2l0aW9ucy5jbGVhclBvdGVudGlhbFBvc2l0aW9uKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIG90aGVyd2lzZSByYW5kb21seSBnZXQgcG90ZW50aWFsIGJvYXJkIHNoaXBcclxuICAgICAgLy8gcG9zaXRpb24gZnJvbSBhdmFpbGFibGVQb3NpdGlvbiBhcnJheVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgcmFuZG9tTnVtYmVyID0gZ2V0UmFuZG9tTnVtYmVyKHRoaXMuYXZhaWxhYmxlUG9zaXRpb25zLmxlbmd0aCk7XHJcbiAgICAgIC8vIGNvbnN0IHJhbmRvbU51bWJlciA9IE1hdGguZmxvb3IoXHJcbiAgICAgIC8vICAgTWF0aC5yYW5kb20oKSAqIHRoaXMuYXZhaWxhYmxlUG9zaXRpb25zLmxlbmd0aFxyXG4gICAgICAvLyApO1xyXG5cclxuICAgICAgLy8gYXNzaWduIHRvIGVsZW1lbnQgb2YgcmFuZG9tbnVtYmVyIGluZGV4XHJcbiAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLmF2YWlsYWJsZVBvc2l0aW9uc1tyYW5kb21OdW1iZXJdO1xyXG5cclxuICAgICAgLy8gbmV4dCByZW1vdmUgdGhlIHBvc2l0aW9uIGZyb20gYXZhaWxhYmVQb3NpdGlvbiBhcnJheVxyXG4gICAgICB0aGlzLmF2YWlsYWJsZVBvc2l0aW9ucy5zcGxpY2UocmFuZG9tTnVtYmVyLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjtcclxuICB9XHJcblxyXG4gIGNsZWFyUG90ZW50aWFsU2hpcFBvc2l0aW9ucygpIHtcclxuICAgIHRoaXMucG90ZW50aWFsU2hpcFBvc2l0aW9ucy5jbGVhclBvdGVudGlhbFBvc2l0aW9uKCk7XHJcbiAgfVxyXG5cclxuICBjbGVhclJlc2VydmVkUG9zaXRpb25zKHJlc2VydmVkUG9zaXRpb25zKSB7XHJcbiAgICByZXNlcnZlZFBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbikgPT4ge1xyXG4gICAgICBjb25zdCBpbmRleCA9IGJpbmFyeVNlYXJjaCh0aGlzLmF2YWlsYWJsZVBvc2l0aW9ucywgcG9zaXRpb24pO1xyXG4gICAgICBpZiAoaW5kZXggPj0gMCkgdGhpcy5hdmFpbGFibGVQb3NpdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ29tcHV0ZXI7XHJcbiIsImltcG9ydCB7IFNISVBfU0laRVMgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvY29uc3RhbnRzXCI7XHJcbmltcG9ydCBHYW1lYm9hcmQgZnJvbSBcIi4uL2dhbWVib2FyZC9nYW1lYm9hcmRcIjtcclxuaW1wb3J0IFNoaXAgZnJvbSBcIi4uL3NoaXAvc2hpcFwiO1xyXG5cclxuY2xhc3MgUGxheWVyIHtcclxuICBnYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XHJcbiAgc2hpcHMgPSBbXTtcclxuICBzdW5rZW5TaGlwcyA9IDA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5hZGRTaGlwcygpO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2hpcHMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zaGlwcztcclxuICB9XHJcblxyXG4gIGdldFBsYXllckJvYXJkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2FtZWJvYXJkLmdldEdhbWVib2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3VycmVudEJvYXJkRGlyZWN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2FtZWJvYXJkLmdldERpcmVjdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlQ3VycmVudEJvYXJkRGlyZWN0aW9uKCkge1xyXG4gICAgdGhpcy5nYW1lYm9hcmQuY2hhbmdlRGlyZWN0aW9uKCk7XHJcbiAgfVxyXG5cclxuICBjbGVhclBsYXllckJvYXJkKCkge1xyXG4gICAgdGhpcy5nYW1lYm9hcmQuY3JlYXRlR2FtZWJvYXJkKCk7XHJcbiAgfVxyXG5cclxuICByZXNldFNoaXBzKCkge1xyXG4gICAgdGhpcy5zdW5rZW5TaGlwcyA9IDA7XHJcbiAgICB0aGlzLmFkZFNoaXBzKCk7XHJcbiAgfVxyXG5cclxuICBhZGRTaGlwcygpIHtcclxuICAgIGlmICh0aGlzLnNoaXBzLmxlbmd0aCAhPT0gMCkgdGhpcy5zaGlwcy5sZW5ndGggPSAwO1xyXG4gICAgU0hJUF9TSVpFUy5mb3JFYWNoKChzaXplKSA9PiB7XHJcbiAgICAgIGxldCBzaGlwID0gbmV3IFNoaXAoc2l6ZSk7XHJcbiAgICAgIHRoaXMuc2hpcHMucHVzaChzaGlwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWRkUmFuZG9tU2hpcHNQb3NpdGlvbigpIHtcclxuICAgIHRoaXMuZ2FtZWJvYXJkLmFkZFJhbmRvbVNoaXBzKHRoaXMuc2hpcHMpO1xyXG4gIH1cclxuXHJcbiAgYWRkU2hpcE9uUGxheWVyR2FtZWJvYXJkKHBvc0EsIHBvc0IsIHNoaXApIHtcclxuICAgIHJldHVybiB0aGlzLmdhbWVib2FyZC5hZGRTaGlwKCtwb3NBLCArcG9zQiwgc2hpcCk7XHJcbiAgfVxyXG5cclxuICByZWNlaXZlQXR0YWNrKHBvc0EsIHBvc0IpIHtcclxuICAgIHJldHVybiB0aGlzLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHBvc0EsIHBvc0IpO1xyXG4gIH1cclxuXHJcbiAgYXR0YWNrRW5lbXlHYW1lYm9hcmQocG9zaXRpb24sIGVuZW15KSB7XHJcbiAgICBjb25zdCB7IHBvc0EsIHBvc0IgfSA9IHBvc2l0aW9uO1xyXG4gICAgcmV0dXJuIGVuZW15LnJlY2VpdmVBdHRhY2soK3Bvc0EsICtwb3NCKTtcclxuICB9XHJcblxyXG4gIGFkZFJlc2VydmVkU2hpcFBvc2l0aW9ucyhyZXNlcnZlZFBvc2l0aW9ucykge1xyXG4gICAgdGhpcy5nYW1lYm9hcmQuYWRkUmVzZXJ2ZWRTaGlwUG9zaXRpb25zKHJlc2VydmVkUG9zaXRpb25zKTtcclxuICB9XHJcblxyXG4gIGluY3JlYXNlU3Vua2VuU2hpcHMoKSB7XHJcbiAgICB0aGlzLnN1bmtlblNoaXBzKys7XHJcbiAgfVxyXG5cclxuICBhbGxTdW5rZW5TaGlwcygpIHtcclxuICAgIHJldHVybiB0aGlzLnN1bmtlblNoaXBzID09PSB0aGlzLnNoaXBzLmxlbmd0aDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcclxuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcclxuXHJcbmNsYXNzIFVzZXIgZXh0ZW5kcyBQbGF5ZXIge1xyXG4gIG5hbWU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIGdldFR5cGUoKSB7XHJcbiAgICByZXR1cm4gXCJ1c2VyXCI7XHJcbiAgfVxyXG5cclxuICBnZXROYW1lKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubmFtZSB8fCBcIlVua25vd25cIjtcclxuICB9XHJcblxyXG4gIHNldE5hbWUobmFtZSkge1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFVzZXI7XHJcbiIsImV4cG9ydCBjbGFzcyBRdWV1ZSB7XHJcbiAgZWxlbWVudHMgPSB7fTtcclxuICBoZWFkID0gMDtcclxuICB0YWlsID0gMDtcclxuXHJcbiAgY2xlYXJRdWV1ZSgpIHtcclxuICAgIHRoaXMuZWxlbWVudHMgPSB7fTtcclxuICAgIHRoaXMuaGVhZCA9IDA7XHJcbiAgICB0aGlzLnRhaWwgPSAwO1xyXG4gIH1cclxuXHJcbiAgZW5xdWV1ZShlbGVtZW50KSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzW3RoaXMudGFpbF0gPSBlbGVtZW50O1xyXG4gICAgdGhpcy50YWlsKys7XHJcbiAgfVxyXG5cclxuICBkZXF1ZXVlKCkge1xyXG4gICAgY29uc3QgaXRlbSA9IHRoaXMuZWxlbWVudHNbdGhpcy5oZWFkXTtcclxuICAgIGRlbGV0ZSB0aGlzLmVsZW1lbnRzW3RoaXMuaGVhZF07XHJcbiAgICB0aGlzLmhlYWQrKztcclxuICAgIHJldHVybiBpdGVtO1xyXG4gIH1cclxuXHJcbiAgcGVlaygpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnRzW3RoaXMuaGVhZF07XHJcbiAgfVxyXG5cclxuICBjb3VudEVsZW1lbnQoY2IpIHtcclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICBmb3IgKGNvbnN0IGVsIGluIHRoaXMuZWxlbWVudHMpIHtcclxuICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuZWxlbWVudHNbZWxdO1xyXG4gICAgICBjb25zdCBjb25kaXRpb24gPSBjYihjdXJyZW50KTtcclxuICAgICAgaWYgKGNvbmRpdGlvbikgYnJlYWs7XHJcbiAgICAgIGNvdW50Kys7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY291bnQ7XHJcbiAgfVxyXG5cclxuICBnZXRMZW5ndGgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50YWlsIC0gdGhpcy5oZWFkO1xyXG4gIH1cclxuXHJcbiAgaXNFbXB0eSgpIHtcclxuICAgIHJldHVybiB0aGlzLmdldExlbmd0aCgpID09PSAwO1xyXG4gIH1cclxuXHJcbiAgYWRkRWxlbWVudHMoZWxlbWVudHMpIHtcclxuICAgIHRoaXMuY2xlYXJRdWV1ZSgpO1xyXG4gICAgZm9yIChsZXQgZWwgb2YgZWxlbWVudHMpIHRoaXMuZW5xdWV1ZShlbCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGdldFJhbmRvbU51bWJlciB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9oZWxwZXJzXCI7XHJcblxyXG5jbGFzcyBTaGlwUG9zaXRpb24ge1xyXG4gIGJvYXJkID0gW107XHJcbiAgLy8gcHJvcGVydGllcyB0byBjaG9vc2UgcG90ZW50aWFsIHBvc2l0b25zXHJcbiAgLy8gd2hlbiBzaGlwIGlzIGhpdFxyXG4gIHBvdGVudGlhbFNoaXBQb3NpdGlvbnMgPSBbXTtcclxuICBuZXh0UG9zaXRpb247XHJcbiAgcG90ZW50aWFsRGlyZWN0aW9ucyA9IFtcclxuICAgIFstMSwgMF0sIC8vIHVwIG5leHQgcG9zaXRpb25cclxuICAgIFswLCAxXSwgLy8gcmlnaHQgbmV4dCBwb3NpdGlvblxyXG4gICAgWzEsIDBdLCAvLyBib3R0b20gbmV4dCBwb3NpdGlvblxyXG4gICAgWzAsIC0xXSwgLy8gbGVmdCBuZXh0IHBvc2l0aW9uXHJcbiAgXTtcclxuXHJcbiAgc2V0Qm9hcmQoYm9hcmQpIHtcclxuICAgIHRoaXMuYm9hcmQgPSBib2FyZDtcclxuICB9XHJcblxyXG4gIGlzRXZlbihkaXJlY3Rpb24pIHtcclxuICAgIHJldHVybiBkaXJlY3Rpb24gJSAyID09PSAwO1xyXG4gIH1cclxuXHJcbiAgaXNPZGQoZGlyZWN0aW9uKSB7XHJcbiAgICByZXR1cm4gZGlyZWN0aW9uICUgMiA9PT0gMTtcclxuICB9XHJcblxyXG4gIC8vIGFkZCBldmVyeSBwb3NzaWJsZSBkaXJlY3Rpb24gdG8gY2hlY2sgY29tcHV0ZXIgYXJyYXkgcG9zaXRpb25zXHJcbiAgY3JlYXRlUG90ZW50aWFsUG9zaXRpb24ocG9zQSwgcG9zQikge1xyXG4gICAgLy8gbG9vcCB0byBjaGVjayBldmVyeSBwb3RlbnRpYWwgZGlyZWN0aW9uIGF2YWlsYWJsZSBvbiBib2FyZFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBvdGVudGlhbERpcmVjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgW3gsIHldID0gdGhpcy5wb3RlbnRpYWxEaXJlY3Rpb25zW2ldO1xyXG4gICAgICBjb25zdCBwb3NYID0gcG9zQSArIHg7XHJcbiAgICAgIGNvbnN0IHBvc1kgPSBwb3NCICsgeTtcclxuICAgICAgLy8gY2hlY2sgaWYgcG90ZW50aWFsIGRpcmVjdGlvbiBleGlzdCBvbiBib2FyZFxyXG4gICAgICBpZiAodGhpcy5ib2FyZFtwb3NYXT8uW3Bvc1ldKSB7XHJcbiAgICAgICAgLy8gbmV4dCB3ZSBjaGVjayBpZiBib2FyZCBjZWxsIGlzIG1hcmtlZFxyXG4gICAgICAgIGlmICghdGhpcy5ib2FyZFtwb3NYXVtwb3NZXS5tYXJrZWQpIHtcclxuICAgICAgICAgIC8vIGRpcmVjdGlvbiBkZWZpbmVzIGFzIGluZGV4J3MgbnVtYmVyIG9mXHJcbiAgICAgICAgICAvLyBwb3RlbnRpYWwgUG9zaXRpb25zXHJcbiAgICAgICAgICB0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMucHVzaCh7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBbcG9zWCwgcG9zWV0sXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbjogaSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0TmV4dFBvdGVudGlhbFNoaXBQb3NpdGlvbigpIHtcclxuICAgIC8vIDEuIEZpcnN0IHdlIGdldCByYW5kb20gbnVtYmVyIGZvciBpbmRleCBvZiBhcnJheSBwb3RlbnRpYWxDb21wdXRlclBvc2l0aW9uc1xyXG5cclxuICAgIGNvbnN0IHJhbmRvbU51bWJlciA9IGdldFJhbmRvbU51bWJlcih0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMubGVuZ3RoKTtcclxuICAgIC8vIGNvbnN0IHJhbmRvbU51bWJlciA9IE1hdGguZmxvb3IoXHJcbiAgICAvLyAgIE1hdGgucmFuZG9tKCkgKiB0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMubGVuZ3RoXHJcbiAgICAvLyApO1xyXG5cclxuICAgIC8vIGV2ZW50dWFsbHkgaWYgZWxlbWVudCBpcyBub3QgaW4gYXJyYXkgd2UgcmV0dXJuIGV4aXN0IG5leHRQb3NpdGlvblxyXG4gICAgaWYgKCF0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnNbcmFuZG9tTnVtYmVyXSkge1xyXG4gICAgICB0aGlzLmNsZWFyUG90ZW50aWFsUG9zaXRpb24oKTtcclxuICAgICAgcmV0dXJuIHRoaXMubmV4dFBvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDIuIG5leHQgd2UgZ2V0IHBvc2l0aW9uIGFuZCBkaXJlY3Rpb24gZnJvbSBlbGVtZW50IG9mXHJcbiAgICAvLyBwb3RlbnRpYWxTaGlwUG9zaXRpb25zIGFycmF5XHJcbiAgICBjb25zdCB7IHBvc2l0aW9uLCBkaXJlY3Rpb24gfSA9IHRoaXMucG90ZW50aWFsU2hpcFBvc2l0aW9uc1tyYW5kb21OdW1iZXJdO1xyXG5cclxuICAgIC8vIDMuIG5leHQgd2UgYXNzaWduIHR3byBwb3NpdGlvbnMgdG8gdmFyaWFibGVzXHJcbiAgICBjb25zdCB4ID0gcG9zaXRpb25bMF07XHJcbiAgICBjb25zdCB5ID0gcG9zaXRpb25bMV07XHJcblxyXG4gICAgLy8gNC4gd2UgYXNzaWduIG5leHRQb3NpdGlvbiB3aXRoIHBvc2l0aW9uIHggYW5kIHBvc2l0aW9uIHlcclxuICAgIC8vIGFuZCB3ZSBleHRyYWN0IHNoaXAgY2VsbCwgbWFya2VkLCBwcm9wZXJ0eSBmcm9tIGJvYXJkIGVsZW1lbnRcclxuICAgIHRoaXMubmV4dFBvc2l0aW9uID0geyBwb3NBOiB4LCBwb3NCOiB5IH07XHJcbiAgICBjb25zdCB7IHNoaXBDZWxsLCBtYXJrZWQgfSA9IHRoaXMuYm9hcmRbeF1beV07XHJcblxyXG4gICAgLy8gNWEuIGNvbmRpdGlvbiB0byBjaGVjayBpZiB0aGVyZSBpcyBub3Qgc2hpcCBjZWxsXHJcbiAgICAvLyB3ZSByZW1vdmluZyBlbGVtZW50IGZyb20gcG90ZW50aWFsU2hpcFBvc2l0aW9uc1xyXG4gICAgaWYgKCFzaGlwQ2VsbCkge1xyXG4gICAgICB0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMuc3BsaWNlKHJhbmRvbU51bWJlciwgMSk7XHJcbiAgICB9XHJcbiAgICAvLyA1Yi4gb3RoZXJ3aXNlIGlzIHRoZXJlIHNoaXBDZWxsIGFuZCBtYXJrZWQgaXMgZmFsc3lcclxuICAgIC8vIHdlIHJlbW92ZSBhbmRcclxuICAgIGVsc2UgaWYgKHNoaXBDZWxsICYmICFtYXJrZWQpIHtcclxuICAgICAgLy8gNWMuIHJlbW92ZSBlbGVtZW50IGZyb20gcG90ZW50aWFsU2hpcFBvc2l0aW9uIGFycmF5XHJcbiAgICAgIHRoaXMucG90ZW50aWFsU2hpcFBvc2l0aW9ucy5zcGxpY2UocmFuZG9tTnVtYmVyLCAxKTtcclxuXHJcbiAgICAgIGNvbnN0IGNvcnJlY3REaXJlY3Rpb24gPSBkaXJlY3Rpb24gJSAyID09PSAwO1xyXG5cclxuICAgICAgLy8gZmlsdGVyIGVsZW1lbnRzIG9ubHkgd2l0aCBjb3JyZWN0IGRpcmVjdGlvblxyXG4gICAgICAvLyBkZXBlbmRpbmcgb24gcG9zaXRpb24gc2hpcCBvbiBib2FyZFxyXG4gICAgICBjb25zdCBmaWx0ZXJQb3NpdGlvbnMgPSB0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMuZmlsdGVyKChwb3NpdGlvbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgZGlyZWN0aW9uIH0gPSBwb3NpdGlvbjtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBjb3JyZWN0RGlyZWN0aW9uXHJcbiAgICAgICAgICA/IHRoaXMuaXNFdmVuKGRpcmVjdGlvbilcclxuICAgICAgICAgIDogdGhpcy5pc09kZChkaXJlY3Rpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMucG90ZW50aWFsU2hpcFBvc2l0aW9ucyA9IGZpbHRlclBvc2l0aW9ucztcclxuXHJcbiAgICAgIC8vIDVjLiB3ZSBzZXQgdG8gY2hlY2sgbmV4dCBwb3NpdGlvbiBpbiB0aGUgc2FtZSBkaXJlY3Rpb25cclxuICAgICAgLy8gbGlrZSBvdXIgZWxlbWVudFxyXG4gICAgICBjb25zdCBbZGlyWCwgZGlyWV0gPSB0aGlzLnBvdGVudGlhbERpcmVjdGlvbnNbZGlyZWN0aW9uXTtcclxuXHJcbiAgICAgIGNvbnN0IG5leHRYID0gZGlyWCArIHg7XHJcbiAgICAgIGNvbnN0IG5leHRZID0gZGlyWSArIHk7XHJcblxyXG4gICAgICAvLyBjaGVjayBpZiB0aGVyZSBpcyBlbGVtZW50IGZvciBuZXh0IHBvc2l0aW9uXHJcbiAgICAgIGlmICh0aGlzLmJvYXJkW25leHRYXT8uW25leHRZXSkge1xyXG4gICAgICAgIC8vIGNoZWNrIGlmIGVsZW1lbnQgb24gYm9hcmQgaXMgbm90IG1hcmtlZCBhbmQgaGFzIHNoaXAgb2JqZWN0XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgIXRoaXMuYm9hcmRbbmV4dFhdW25leHRZXS5tYXJrZWQgJiZcclxuICAgICAgICAgIHRoaXMuYm9hcmRbbmV4dFhdW25leHRZXS5zaGlwQ2VsbFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgLy8gd2UgYWRkIG5leHQgcG9zc2libGUgcG9zaXRpb24gdG9cclxuICAgICAgICAgIC8vIHBvdGVudGlhbCBjb21wdXRlciBwb3NpdGlvbiBhcnJheVxyXG4gICAgICAgICAgdGhpcy5wb3RlbnRpYWxTaGlwUG9zaXRpb25zLnB1c2goe1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogW25leHRYLCBuZXh0WV0sXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbixcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gcmV0dXJuIG5leHRQb3NpdGlvbiB0byBjaGVjayBvbiB1c2VyIGJvYXJkXHJcblxyXG4gICAgcmV0dXJuIHRoaXMubmV4dFBvc2l0aW9uO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWRqYWNlbnRIaXRQb3NpdGlvbnMocG9zaXRpb24pIHtcclxuICAgIGlmICh0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGNvbnN0IHsgcG9zQSwgcG9zQiB9ID0gcG9zaXRpb247XHJcbiAgICAgIHRoaXMuY3JlYXRlUG90ZW50aWFsUG9zaXRpb24ocG9zQSwgcG9zQik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TmV4dFBvdGVudGlhbFNoaXBQb3NpdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgLy8gY2xlYXIgcG90ZW50aWFsIGNvbXB1dGVyIHBvc2l0aW9ucyBtb3ZlcyBmcm9tIGFycmF5XHJcbiAgY2xlYXJQb3RlbnRpYWxQb3NpdGlvbigpIHtcclxuICAgIHRoaXMucG90ZW50aWFsU2hpcFBvc2l0aW9ucy5sZW5ndGggPSAwO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2hpcFBvc2l0aW9uO1xyXG4iLCJpbXBvcnQgeyBjdXN0b21BbHBoYWJldCB9IGZyb20gXCJuYW5vaWRcIjtcclxuaW1wb3J0IHsgQ1VTVE9NX0FMUEhBQkVULCBTSVpFX0lEIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2NvbnN0YW50c1wiO1xyXG5cclxuY2xhc3MgU2hpcCB7XHJcbiAgaWQ7XHJcbiAgbGVuZ3RoO1xyXG4gIGhpdHMgPSAwO1xyXG4gIHJlc2VydmVkUG9zaXRpb25zID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKGwpIHtcclxuICAgIHRoaXMubGVuZ3RoID0gbDtcclxuICAgIHRoaXMuaWQgPSB0aGlzLmNyZWF0ZUN1c3RvbUlEKCk7XHJcbiAgfVxyXG5cclxuICBnZXRJRCgpIHtcclxuICAgIHJldHVybiB0aGlzLmlkO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGVuZ3RoKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgZ2V0SGl0cygpIHtcclxuICAgIHJldHVybiB0aGlzLmhpdHM7XHJcbiAgfVxyXG5cclxuICBnZXRTdW5rKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBnZXRSZXNlcnZlZFBvc2l0aW9ucygpIHtcclxuICAgIHJldHVybiB0aGlzLnJlc2VydmVkUG9zaXRpb25zO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlQ3VzdG9tSUQoKSB7XHJcbiAgICBsZXQgbmFub2lkID0gY3VzdG9tQWxwaGFiZXQoQ1VTVE9NX0FMUEhBQkVULCBTSVpFX0lEKTtcclxuICAgIHJldHVybiBuYW5vaWQoKTtcclxuICB9XHJcblxyXG4gIGNsZWFyUmVzZXJ2ZWRQb3NpdGlvbnMoKSB7XHJcbiAgICB0aGlzLnJlc2VydmVkUG9zaXRpb25zLmxlbmd0aCA9IDA7XHJcbiAgfVxyXG5cclxuICBhZGRSZXNlcnZlZFBvc2l0aW9ucyhwb3MpIHtcclxuICAgIHRoaXMucmVzZXJ2ZWRQb3NpdGlvbnMucHVzaChwb3MpO1xyXG4gIH1cclxuXHJcbiAgcmVjZWl2ZUhpdCgpIHtcclxuICAgIGlmICh0aGlzLmhpdHMgPCB0aGlzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmhpdHMrKztcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNoaXA7XHJcbiIsImltcG9ydCB7IEhPUklaT05UQUwsIFZFUlRJQ0FMIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NvbnN0YW50c1wiO1xyXG5cclxuY2xhc3MgR2FtZXBsYXlWaWV3IHtcclxuICBnYW1lRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVcIik7XHJcbiAgZ2FtZVVzZXJFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlclwiKTtcclxuICBnYW1lQ29tcHV0ZXJFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tcHV0ZXJcIik7XHJcblxyXG4gIGdhbWVib2FyZFVzZXJFbCA9IHRoaXMuZ2FtZVVzZXJFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtYm9hcmRcIik7XHJcbiAgZ2FtZWJvYXJkQ29tcHV0ZXJFbCA9IHRoaXMuZ2FtZUNvbXB1dGVyRWwucXVlcnlTZWxlY3RvcihcIi5nYW1lLWJvYXJkXCIpO1xyXG5cclxuICBnYW1lQ29udHJvbHNFbCA9IHRoaXMuZ2FtZVVzZXJFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtY29udHJvbHNcIik7XHJcbiAgZ2FtZVNoaXBFbCA9IHRoaXMuZ2FtZVVzZXJFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtc2hpcFwiKTtcclxuXHJcbiAgZ2FtZVNoaXBPYmplY3RFbCA9IHRoaXMuZ2FtZVVzZXJFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtc2hpcC1vYmplY3RcIik7XHJcbiAgZ2FtZVNoaXBBbW91bnRFbCA9IHRoaXMuZ2FtZVVzZXJFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtc2hpcC1hbW91bnRcIik7XHJcblxyXG4gIHBsYXlHYW1lQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5XCIpO1xyXG4gIHJhbmRvbVNoaXBCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhbmRvbVwiKTtcclxuICByZXNldFNoaXBCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc2V0XCIpO1xyXG5cclxuICBkcmFnZ2VkRWwgPSBudWxsO1xyXG5cclxuICBzaG93R2FtZXBsYXkoKSB7XHJcbiAgICB0aGlzLmdhbWVFbC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gICAgdGhpcy5nYW1lQ29udHJvbHNFbC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gICAgdGhpcy5zaG93U2hpcFBpY2soKTtcclxuICB9XHJcblxyXG4gIHJlbmRlckdhbWVwbGF5KHBsYXllcnMpIHtcclxuICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcbiAgICAgIGNvbnN0IHR5cGUgPSBwbGF5ZXIuZ2V0VHlwZSgpO1xyXG4gICAgICBjb25zdCBuYW1lID0gcGxheWVyLmdldE5hbWUoKTtcclxuICAgICAgY29uc3QgYm9hcmQgPSBwbGF5ZXIuZ2V0UGxheWVyQm9hcmQoKTtcclxuICAgICAgY29uc3Qgc2hpcHMgPSBwbGF5ZXIuZ2V0U2hpcHMoKTtcclxuXHJcbiAgICAgIGNvbnN0IHBsYXllckVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodHlwZSk7XHJcbiAgICAgIGNvbnN0IHBsYXllck5hbWVFbCA9IHBsYXllckVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1wbGF5ZXJuYW1lXCIpO1xyXG4gICAgICBjb25zdCBnYW1lYm9hcmRFbCA9IHBsYXllckVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1ib2FyZFwiKTtcclxuICAgICAgY29uc3Qgc2hpcExpc3RFbCA9IHBsYXllckVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1saXN0LXNoaXBcIik7XHJcblxyXG4gICAgICB0aGlzLnJlbmRlclBsYXllcm5hbWUocGxheWVyTmFtZUVsLCBuYW1lKTtcclxuICAgICAgdGhpcy5yZW5kZXJHYW1lYm9hcmQoZ2FtZWJvYXJkRWwsIGJvYXJkKTtcclxuICAgICAgdGhpcy5yZW5kZXJTaGlwTGlzdChzaGlwTGlzdEVsLCBzaGlwcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnJlbmRlckluaXRpYWxHYW1lUGFuZWxzKCk7XHJcbiAgICAvLyB0aGlzLnRvZ2dsZUdhbWVQYW5lbCh0aGlzLmdhbWVDb21wdXRlckVsKTtcclxuICAgIHRoaXMuc2hvd0dhbWVwbGF5KCk7XHJcbiAgfVxyXG5cclxuICByZW5kZXJJbml0aWFsR2FtZVBhbmVscygpIHtcclxuICAgIHRoaXMuZ2FtZVVzZXJFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtcGFuZWxcIikuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xyXG4gICAgdGhpcy5nYW1lQ29tcHV0ZXJFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtcGFuZWxcIikuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyUGxheWVybmFtZShlbGVtZW50LCBuYW1lKSB7XHJcbiAgICBjb25zdCBwbGF5ZXJuYW1lID0gbmFtZSB8fCBcInVua25vd25cIjtcclxuICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBwbGF5ZXJuYW1lICsgXCIncyBib2FyZFwiO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyR2FtZWJvYXJkUmFuZG9tKGJvYXJkKSB7XHJcbiAgICBjb25zdCBnYW1lYm9hcmRFbCA9IHRoaXMuZ2FtZVVzZXJFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtYm9hcmRcIik7XHJcbiAgICB0aGlzLnJlbmRlckdhbWVib2FyZChnYW1lYm9hcmRFbCwgYm9hcmQpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyR2FtZWJvYXJkKGVsZW1lbnQsIGJvYXJkKSB7XHJcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgY29uc3Qgc2l6ZSA9IGJvYXJkLmxlbmd0aCAqIGJvYXJkLmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xyXG4gICAgICBsZXQgcG9zaXRpb24gPSAoXCIwXCIgKyBpKS5zbGljZSgtMik7XHJcbiAgICAgIGNvbnN0IFtwb3NBLCBwb3NCXSA9IHBvc2l0aW9uLnNwbGl0KFwiXCIpO1xyXG5cclxuICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG5cclxuICAgICAgY29uc3QgY2xzID0gYm9hcmRbK3Bvc0FdWytwb3NCXS5zaGlwQ2VsbFxyXG4gICAgICAgID8gXCJnYW1lLWNlbGwgZ2FtZS1jZWxsLXNoaXBcIlxyXG4gICAgICAgIDogXCJnYW1lLWNlbGxcIjtcclxuXHJcbiAgICAgIHNwYW4uY2xhc3NOYW1lID0gY2xzO1xyXG5cclxuICAgICAgc3Bhbi5kYXRhc2V0LnBvc0EgPSBwb3NBO1xyXG4gICAgICBzcGFuLmRhdGFzZXQucG9zQiA9IHBvc0I7XHJcblxyXG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHNwYW4pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyU2hpcExpc3QoZWwsIHNoaXBzKSB7XHJcbiAgICBlbC5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XHJcbiAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwc1tpXS5nZXRMZW5ndGgoKTtcclxuICAgICAgY29uc3Qgc2hpcElEID0gc2hpcHNbaV0uZ2V0SUQoKTtcclxuXHJcbiAgICAgIGxpLmRhdGFzZXQuc2hpcElkID0gc2hpcElEO1xyXG4gICAgICBsaS5jbGFzc05hbWUgPSBcImdhbWUtaXRlbS1zaGlwXCI7XHJcblxyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXBMZW5ndGg7IGorKykge1xyXG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBzcGFuLmNsYXNzTmFtZSA9IFwiZ2FtZS1pdGVtLXBhcnRcIjtcclxuICAgICAgICBsaS5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgICAgfVxyXG4gICAgICBlbC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW5kZXJTaGlwUGljayhzaGlwUGljaykge1xyXG4gICAgY29uc3QgeyBzaGlwLCBjdXJyZW50U2hpcExlZnQsIGRpcmVjdGlvbiB9ID0gc2hpcFBpY2s7XHJcbiAgICB0aGlzLnNob3dTaGlwUGljaygpO1xyXG4gICAgdGhpcy5nYW1lU2hpcE9iamVjdEVsLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB0aGlzLmdhbWVTaGlwT2JqZWN0RWwuc2V0QXR0cmlidXRlKFwiZGF0YS1kaXJlY3Rpb25cIiwgZGlyZWN0aW9uKTtcclxuXHJcbiAgICBpZiAoIXNoaXApIHtcclxuICAgICAgdGhpcy5oaWRlU2hpcFBpY2soKTtcclxuICAgICAgdGhpcy5zaG93UGxheUJ1dHRvbigpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IHNoaXAuZ2V0TGVuZ3RoKCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBzcGFuLmNsYXNzTmFtZSA9IFwiZ2FtZS1zaGlwLXBhcnRcIjtcclxuXHJcbiAgICAgIHRoaXMuZ2FtZVNoaXBPYmplY3RFbC5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGlyZWN0aW9uID09PSBIT1JJWk9OVEFMKSB7XHJcbiAgICAgIHRoaXMuZ2FtZVNoaXBPYmplY3RFbC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke3RoaXMuZ2FtZVNoaXBPYmplY3RFbC5jaGlsZHJlbi5sZW5ndGh9LCAxZnIpYDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZ2FtZVNoaXBPYmplY3RFbC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgxLCAxZnIpYDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdhbWVTaGlwQW1vdW50RWwudGV4dENvbnRlbnQgPSBgeCR7Y3VycmVudFNoaXBMZWZ0fWA7XHJcbiAgfVxyXG5cclxuICByZW5kZXJHYW1lYm9hcmRTaGlwKGRhdGFCb2FyZCwgc2hpcCkge1xyXG4gICAgY29uc3QgeyBwb3NBLCBwb3NCLCBkaXJlY3Rpb24gfSA9IGRhdGFCb2FyZDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuZ2V0TGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICBjb25zdCBjZWxsUG9zQSA9IGRpcmVjdGlvbiA9PT0gVkVSVElDQUwgPyBpICogMSArICtwb3NBIDogK3Bvc0E7XHJcbiAgICAgIGNvbnN0IGNlbGxQb3NCID0gZGlyZWN0aW9uID09PSBWRVJUSUNBTCA/ICtwb3NCIDogK3Bvc0IgKyBpICogMTtcclxuICAgICAgY29uc3QgcGFydEVsID0gdGhpcy5nYW1lVXNlckVsLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgYFtkYXRhLXBvcy1hPVwiJHtjZWxsUG9zQX1cIl1bZGF0YS1wb3MtYj1cIiR7Y2VsbFBvc0J9XCJdYFxyXG4gICAgICApO1xyXG4gICAgICBwYXJ0RWwuY2xhc3NMaXN0LmFkZChcImdhbWUtY2VsbC1zaGlwXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyUGxheWVyVHVybihuYW1lKSB7XHJcbiAgICBjb25zdCBodG1sID0gYDxkaXYgY2xhc3M9XCJnYW1lLXR1cm5cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJnYW1lLWN1cnJlbnQtbmFtZSBvcGFxdWVcIj4ke25hbWV9J3MgdHVybjwvZGl2PlxyXG4gIDwvZGl2PmA7XHJcbiAgICB0aGlzLmdhbWVFbC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgaHRtbCk7XHJcbiAgICAvLyB0aGlzLmdhbWVFbC5pbnNlcnRBZGphY2VudEhUTUwoXCJhZnRlcmJlZ2luXCIsIGh0bWwpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJQbGF5ZXJUdXJuKCkge1xyXG4gICAgY29uc3QgZWwgPSB0aGlzLmdhbWVFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtdHVyblwiKTtcclxuICAgIGVsLnJlbW92ZSgpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyTWFya2VkQ2VsbChwb3NpdGlvbiwgc2hpcCwgdHlwZSkge1xyXG4gICAgY29uc3QgeyBwb3NBLCBwb3NCIH0gPSBwb3NpdGlvbjtcclxuICAgIGNvbnN0IGdhbWVib2FyZEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodHlwZSk7XHJcblxyXG4gICAgY29uc3QgdGFyZ2V0Q2VsbEVsID0gZ2FtZWJvYXJkRWwucXVlcnlTZWxlY3RvcihcclxuICAgICAgYFtkYXRhLXBvcy1hPVwiJHtwb3NBfVwiXVtkYXRhLXBvcy1iPVwiJHtwb3NCfVwiXWBcclxuICAgICk7XHJcblxyXG4gICAgaWYgKCFzaGlwKSB0YXJnZXRDZWxsRWwuY2xhc3NMaXN0LmFkZChcInJlc2VydmVkXCIpO1xyXG5cclxuICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHNwYW4uY2xhc3NOYW1lID0gc2hpcCA/IFwiaGl0XCIgOiBcIm1pc3NcIjtcclxuXHJcbiAgICB0YXJnZXRDZWxsRWwuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgfVxyXG5cclxuICByZW5kZXJSZXNlcnZlZFBvc2l0aW9ucyh0eXBlLCByZXNlcnZlZFBvc2l0aW9ucykge1xyXG4gICAgY29uc3QgZ2FtZWJvYXJkRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0eXBlKTtcclxuXHJcbiAgICByZXNlcnZlZFBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbikgPT4ge1xyXG4gICAgICBjb25zdCB7IHBvc0EsIHBvc0IgfSA9IHBvc2l0aW9uO1xyXG4gICAgICBjb25zdCBjZWxsRWwgPSBnYW1lYm9hcmRFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgIGBbZGF0YS1wb3MtYT1cIiR7cG9zQX1cIl1bZGF0YS1wb3MtYj1cIiR7cG9zQn1cIl1gXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoIWNlbGxFbC5jbGFzc0xpc3QuY29udGFpbnMoXCJyZXNlcnZlZFwiKSkge1xyXG4gICAgICAgIGNlbGxFbC5jbGFzc0xpc3QuYWRkKFwicmVzZXJ2ZWRcIik7XHJcbiAgICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHNwYW4uY2xhc3NOYW1lID0gXCJtaXNzXCI7XHJcbiAgICAgICAgY2VsbEVsLmFwcGVuZENoaWxkKHNwYW4pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlclN1bmtTaGlwKGlkKSB7XHJcbiAgICBjb25zdCBzaGlwSXRlbUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2hpcC1pZD1cIiR7aWR9XCJdYCk7XHJcbiAgICBzaGlwSXRlbUVsLmNsYXNzTGlzdC5hZGQoXCJzdW5rXCIpO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlUGxheWVyVHVybihuYW1lKSB7XHJcbiAgICBjb25zdCBlbCA9IHRoaXMuZ2FtZUVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1jdXJyZW50LW5hbWVcIik7XHJcbiAgICBlbC50ZXh0Q29udGVudCA9IGAke25hbWV9J3MgdHVybmA7XHJcbiAgICBlbC5jbGFzc0xpc3QuYWRkKFwib3BhcXVlXCIpO1xyXG4gIH1cclxuXHJcbiAgaGlkZVBsYXllclR1cm4oKSB7XHJcbiAgICBjb25zdCBlbCA9IHRoaXMuZ2FtZUVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1jdXJyZW50LW5hbWVcIik7XHJcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKFwib3BhcXVlXCIpO1xyXG4gIH1cclxuXHJcbiAgc2hvd1NoaXBQaWNrKCkge1xyXG4gICAgdGhpcy5nYW1lU2hpcEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbiAgfVxyXG5cclxuICBoaWRlU2hpcFBpY2soKSB7XHJcbiAgICB0aGlzLmdhbWVTaGlwRWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICB9XHJcblxyXG4gIHNob3dQbGF5QnV0dG9uKCkge1xyXG4gICAgdGhpcy5wbGF5R2FtZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gIH1cclxuXHJcbiAgaGlkZVBsYXlCdXR0b24oKSB7XHJcbiAgICB0aGlzLnBsYXlHYW1lQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbiAgfVxyXG5cclxuICBzaG93UmVzZXJ2ZWRDZWxscyhib2FyZCkge1xyXG4gICAgdGhpcy5nYW1lYm9hcmRVc2VyRWwucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lLWNlbGxcIikuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICBjb25zdCB7IHBvc0EsIHBvc0IgfSA9IGNlbGwuZGF0YXNldDtcclxuICAgICAgY29uc3QgeyByZXNlcnZlZCB9ID0gYm9hcmRbK3Bvc0FdWytwb3NCXTtcclxuXHJcbiAgICAgIGlmIChyZXNlcnZlZCkge1xyXG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGwtZGlzYWJsZWRcIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaGlkZVJlc2VydmVkQ2VsbHMoYm9hcmQpIHtcclxuICAgIHRoaXMuZ2FtZWJvYXJkVXNlckVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZS1jZWxsXCIpLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgY29uc3QgeyBwb3NBLCBwb3NCIH0gPSBjZWxsLmRhdGFzZXQ7XHJcbiAgICAgIGNvbnN0IHsgcmVzZXJ2ZWQgfSA9IGJvYXJkWytwb3NBXVsrcG9zQl07XHJcblxyXG4gICAgICBpZiAocmVzZXJ2ZWQpIHtcclxuICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJjZWxsLWRpc2FibGVkXCIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZUdhbWVQYW5lbChlbCkge1xyXG4gICAgZWwucXVlcnlTZWxlY3RvcihcIi5nYW1lLXBhbmVsXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJkaXNhYmxlZFwiKTtcclxuICB9XHJcblxyXG4gIHN3aXRjaEdhbWVQYW5lbCgpIHtcclxuICAgIHRoaXMudG9nZ2xlR2FtZVBhbmVsKHRoaXMuZ2FtZUNvbXB1dGVyRWwpO1xyXG4gICAgdGhpcy50b2dnbGVHYW1lUGFuZWwodGhpcy5nYW1lVXNlckVsKTtcclxuICB9XHJcblxyXG4gIGdldENvbXB1dGVyQm9hcmRQb3NpdGlvbihldmVudCkge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG5cclxuICAgIGNvbnN0IGNlbGxFbCA9IHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJnYW1lLWNlbGxcIik7XHJcbiAgICBpZiAoIWNlbGxFbCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHsgcG9zQSwgcG9zQiB9ID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQ7XHJcblxyXG4gICAgcmV0dXJuIHsgcG9zQSwgcG9zQiB9O1xyXG4gIH1cclxuXHJcbiAgLy8gRVZFTlQgRlVOQ1RJT05TXHJcblxyXG4gIG9uQ2xpY2tQbGF5QnRuKGNiKSB7XHJcbiAgICB0aGlzLnBsYXlHYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZ2FtZUNvbnRyb2xzRWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgY2IoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVzZXQgYnV0dG9uIGV2ZW50XHJcbiAgb25DbGlja1Jlc2V0QnRuKGNiKSB7XHJcbiAgICB0aGlzLnJlc2V0U2hpcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBjYigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyByYW5kb20gYnV0dG9uIGV2ZW50XHJcbiAgb25DbGlja1JhbmRvbUJ0bihjYikge1xyXG4gICAgdGhpcy5yYW5kb21TaGlwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIGNiKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIHNoaXAgb2JqZWN0IGVsIGV2ZW50c1xyXG4gIG9uQ2xpY2tTaGlwRWwoY2IpIHtcclxuICAgIHRoaXMuZ2FtZVNoaXBPYmplY3RFbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBjYigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkRyYWdTaGlwRWwoYm9hcmQpIHtcclxuICAgIC8vIHN0YXJ0IGRyYWdnYWJsZVxyXG4gICAgdGhpcy5nYW1lU2hpcE9iamVjdEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgIHRoaXMuZHJhZ2dlZEVsID0gZXZlbnQudGFyZ2V0OyAvLyB0YXJnZXQgZWxlbWVudCwgd2hpY2ggaXMgZHJhZ2dlYmxlXHJcbiAgICAgIHRoaXMuc2hvd1Jlc2VydmVkQ2VsbHMoYm9hcmQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5nYW1lU2hpcE9iamVjdEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW5kXCIsICgpID0+IHtcclxuICAgICAgLy8gZmlyZXMgd2hlbiB1c2VyIGVuIHRvIGRyYWcgZWxlbWVudDtcclxuICAgICAgdGhpcy5oaWRlUmVzZXJ2ZWRDZWxscyhib2FyZCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uRHJvcFNoaXBFbChjYikge1xyXG4gICAgLy8gY29uc3QgZ2FtZUJvYXJkRWwgPSB0aGlzLmdhbWVVc2VyRWwucXVlcnlTZWxlY3RvcihcIi5nYW1lLWJvYXJkXCIpO1xyXG5cclxuICAgIHRoaXMuZ2FtZWJvYXJkVXNlckVsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCAoZXZlbnQpID0+IHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZ2FtZWJvYXJkVXNlckVsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIChldmVudCkgPT4ge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLmRyYWdnZWRFbCB8fCAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImdhbWUtY2VsbFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBjb25zdCB7IHBvc0EsIHBvc0IgfSA9IGV2ZW50LnRhcmdldC5kYXRhc2V0O1xyXG4gICAgICBjb25zdCB7IGRpcmVjdGlvbiB9ID0gdGhpcy5kcmFnZ2VkRWwuZGF0YXNldDtcclxuXHJcbiAgICAgIGNvbnN0IGRhdGFET00gPSB7XHJcbiAgICAgICAgcG9zQSxcclxuICAgICAgICBwb3NCLFxyXG4gICAgICAgIGRpcmVjdGlvbixcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMuZHJhZ2dlZEVsID0gbnVsbDtcclxuXHJcbiAgICAgIGNiKGRhdGFET00pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrQ29tcHV0ZXJHYW1lYm9hcmQoY2IpIHtcclxuICAgIHRoaXMuZ2FtZWJvYXJkQ29tcHV0ZXJFbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2IpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlQ2xpY2tDb21wdXRlckdhbWVib2FyZChjYikge1xyXG4gICAgdGhpcy5nYW1lYm9hcmRDb21wdXRlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBHYW1lcGxheVZpZXc7XHJcbiIsImNsYXNzIE1lbnVWaWV3IHtcclxuICBtZW51RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnVcIik7XHJcbiAgZmllbGRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS1maWVsZFwiKTtcclxuICBpbnB1dEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXJfbmFtZVwiKTtcclxuXHJcbiAgc3RhcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1zdGFydC1nYW1lXCIpO1xyXG5cclxuICBtZW51RXJyb3JFbDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnJlbmRlckljb24oKTtcclxuICAgIHRoaXMuaW5wdXRFbC5mb2N1cygpO1xyXG4gICAgdGhpcy5vbkNoYW5nZUlucHV0KCk7XHJcbiAgICB0aGlzLm1lbnVFcnJvckVsID0gdGhpcy5yZW5kZXJNZW51RXJyb3IoKTtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2tTdGFydEJ1dHRvbihjYWxsYmFjaykge1xyXG4gICAgdGhpcy5zdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBjYWxsYmFjayh0aGlzLmlucHV0RWwudmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzaG93RXJyb3IoKSB7XHJcbiAgICBpZiAoIWRvY3VtZW50LmNvbnRhaW5zKHRoaXMubWVudUVycm9yRWwpKVxyXG4gICAgICB0aGlzLmZpZWxkRWwuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCB0aGlzLm1lbnVFcnJvckVsKTtcclxuICB9XHJcblxyXG4gIHJlbmRlck1lbnVFcnJvcigpIHtcclxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBkaXYuY2xhc3NOYW1lID0gXCJtZW51LWVycm9yXCI7XHJcbiAgICBkaXYudGV4dENvbnRlbnQgPSBcIlVwcyEgWW91IGZvcmdvdCBhIG5hbWUhXCI7XHJcblxyXG4gICAgcmV0dXJuIGRpdjtcclxuICB9XHJcblxyXG4gIGhpZGVTdGFydE1lbnUoKSB7XHJcbiAgICB0aGlzLm1lbnVFbC5jbGFzc0xpc3QucmVtb3ZlKFwic2hvd1wiKTtcclxuICB9XHJcblxyXG4gIHJlbmRlckljb24oKSB7XHJcbiAgICBjb25zdCBzdmcgPSBgPHN2Z1xyXG4gICAgaWQ9XCJ0YXJnZXQtaWNvblwiXHJcbiAgICB3aWR0aD1cIjEwMCVcIlxyXG4gICAgaGVpZ2h0PVwiMTAwJVwiXHJcbiAgICB2aWV3Qm94PVwiMCAwIDE0NC40OTc3NyAxNDQuNDk3NzdcIlxyXG4gICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiXHJcbiAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgIHhtbG5zOnN2Zz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICA+XHJcbiAgICA8ZGVmcyAgLz5cclxuICAgIDxnIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgtMzkuNDA1MjUxLC00Mi40NzU3MzcpXCI+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgc3R5bGU9XCJmaWxsOiAjZmZmZmZmXCJcclxuICAgICAgICBkPVwibSAxMDcuNDIwOCwxODIuNTAxOTcgdiAtNC40Njk1NCBsIC0zLjA5NTcyLC0wLjMzNTc2IEMgOTMuMTgwNzI3LDE3Ni40ODk5NiA4Mi40NDMxNTYsMTcyLjEzMTQ1IDcyLjk4OTY5MiwxNjQuOTc5MjcgNjkuOTA2MTA2LDE2Mi42NDYzMyA2My43MzI0MywxNTYuNDcyNjYgNjEuMzk5NDksMTUzLjM4OTA3IDU0LjI0NzMxLDE0My45MzU2MSA0OS44ODg4MDcsMTMzLjE5ODA0IDQ4LjY4MDA5NiwxMjIuMDUzNjggbCAtMC4zMzU3NiwtMy4wOTU3MiBoIC00LjQ2OTU0MyAtNC40Njk1NDQgdiAtNC4yMzMzMyAtNC4yMzMzNCBoIDQuNDY5NTQ0IDQuNDY5NTQzIGwgMC4zMzU3NiwtMy4wOTU3MiBDIDQ5Ljg4ODgwNyw5Ni4yNTEyMTkgNTQuMjQ3MzEsODUuNTEzNjQ5IDYxLjM5OTQ5LDc2LjA2MDE3OSA2My43MzI0Myw3Mi45NzY1OTkgNjkuOTA2MTA2LDY2LjgwMjkxOSA3Mi45ODk2OTIsNjQuNDY5OTggODIuNDQzMTU2LDU3LjMxNzggOTMuMTgwNzI3LDUyLjk1OTI5NyAxMDQuMzI1MDgsNTEuNzUwNTg3IGwgMy4wOTU3MiwtMC4zMzU3NjEgViA0Ni45NDUyODMgNDIuNDc1NzQgaCA0LjIzMzM0IDQuMjMzMzMgdiA0LjQ2OTU0MyA0LjQ2OTU0MyBsIDMuMDk1NzIsMC4zMzU3NjEgYyAxMS4xNDQzNiwxLjIwODcxIDIxLjg4MTkzLDUuNTY3MjEzIDMxLjMzNTM5LDEyLjcxOTM5MyAzLjA4MzU5LDIuMzMyOTM5IDkuMjU3MjYsOC41MDY2MTkgMTEuNTkwMiwxMS41OTAxOTkgNy4xNTIxOCw5LjQ1MzQ3IDExLjUxMDY5LDIwLjE5MTA0IDEyLjcxOTQsMzEuMzM1MzkxIGwgMC4zMzU3NiwzLjA5NTcyIGggNC40Njk1NCA0LjQ2OTU0IHYgNC4yMzMzNCA0LjIzMzMzIGggLTQuNDY5NTQgLTQuNDY5NTQgbCAtMC4zMzU3NiwzLjA5NTcyIGMgLTEuMjA4NzEsMTEuMTQ0MzYgLTUuNTY3MjIsMjEuODgxOTMgLTEyLjcxOTQsMzEuMzM1MzkgLTIuMzMyOTQsMy4wODM1OSAtOC41MDY2MSw5LjI1NzI2IC0xMS41OTAyLDExLjU5MDIgLTkuNDUzNDYsNy4xNTIxOCAtMjAuMTkxMDMsMTEuNTEwNjkgLTMxLjMzNTM5LDEyLjcxOTQgbCAtMy4wOTU3MiwwLjMzNTc2IHYgNC40Njk1NCA0LjQ2OTU0IGggLTQuMjMzMzMgLTQuMjMzMzQgeiBtIDAsLTIxLjQ1OTA0IHYgLTguNDMwODEgbCAtMi42MTA1NSwtMC40NzU0NiBjIC01LjEwNzExMSwtMC45MzAxNCAtMTAuNDE0OTExLC0zLjEzMTg5IC0xNC44NTUzMzMsLTYuMTYyMTggLTIuNzU5MjIzLC0xLjg4Mjk5IC03LjY2OTY0NywtNi43OTM0MSAtOS41NTI2MzQsLTkuNTUyNjQgLTMuMDMwMjk0LC00LjQ0MDQyIC01LjIzMjAzOSwtOS43NDgyMiAtNi4xNjIxODUsLTE0Ljg1NTMyIGwgLTAuNDc1NDU1LC0yLjYxMDU2IGggLTguNDY3Mjc0IC04LjQ2NzI3NSBsIDAuMjAwMDc4LDIuMDQ2MTEgYyAxLjg3NTUxMiwxOS4xODAwOSAxNS40MzMxNDIsMzcuMTAzNTYgMzMuNzM5NTIsNDQuNjA0MzUgNC43NjkwMDEsMS45NTQwMyAxMS43NzQxODgsMy42NzI0NiAxNS41OTI3NzgsMy44MjUwMyBsIDEuMDU4MzMsMC4wNDIzIHogbSAxNS4xOTY0NCw3LjU2MjQ4IGMgMjEuNTk1OTEsLTQuNDMwNTEgMzguNDg5MTcsLTIxLjMyMzc3IDQyLjkxOTY4LC00Mi45MTk2OCAwLjI5NzYxLC0xLjQ1MDY1IDAuNjMxMTQsLTMuNTU4MyAwLjc0MTE4LC00LjY4MzY2IGwgMC4yMDAwOCwtMi4wNDYxMSBoIC04LjQ2NzI4IC04LjQ2NzI3IGwgLTAuNDc1NDYsMi42MTA1NiBjIC0wLjkzMDE0LDUuMTA3MSAtMy4xMzE4OSwxMC40MTQ5IC02LjE2MjE4LDE0Ljg1NTMyIC0xLjg4Mjk5LDIuNzU5MjMgLTYuNzkzNDEsNy42Njk2NSAtOS41NTI2Myw5LjU1MjY0IC00LjQ0MDQzLDMuMDMwMjkgLTkuNzQ4MjMsNS4yMzIwNCAtMTQuODU1MzMsNi4xNjIxOCBsIC0yLjYxMDU2LDAuNDc1NDYgdiA4LjQ2NzI3IDguNDY3MjggbCAyLjA0NjExLC0wLjIwMDA4IGMgMS4xMjUzNiwtMC4xMTAwNCAzLjIzMzAxLC0wLjQ0MzU4IDQuNjgzNjYsLTAuNzQxMTggeiBtIC0xNS4xOTY0NCwtMjguNjIzOSB2IC00LjA5MjIyIGggNC4yMzMzNCA0LjIzMzMzIHYgNC4xMDUwMSA0LjEwNTAxIGwgMS4wNTgzMywtMC4xODM4NyBjIDAuNTgyMDksLTAuMTAxMTIgMi40Mjk2LC0wLjYzMjMgNC4xMDU1OCwtMS4xODAzOCA4Ljc2NDM3LC0yLjg2NjE2IDE1Ljc0OTA0LC05Ljg1MDgyIDE4LjYxNTE5LC0xOC42MTUxOSAwLjU0ODA4LC0xLjY3NTk4IDEuMDc5MjYsLTMuNTIzNDkgMS4xODAzOSwtNC4xMDU1OCBsIDAuMTgzODYsLTEuMDU4MzMgaCAtNC4xMDUwMSAtNC4xMDUwMSB2IC00LjIzMzMzIC00LjIzMzM0IGggNC4xMDUwMSA0LjEwNTAxIGwgLTAuMTgzODYsLTEuMDU4MzMgYyAtMC4xMDExMywtMC41ODIwOCAtMC42MzIzMSwtMi40Mjk1OSAtMS4xODAzOSwtNC4xMDU1OCAtMi44NjYxNSwtOC43NjQzNjEgLTkuODUwODIsLTE1Ljc0OTAzMSAtMTguNjE1MTksLTE4LjYxNTE4MSAtMS42NzU5OCwtMC41NDgwOSAtMy41MjM0OSwtMS4wNzkyNiAtNC4xMDU1OCwtMS4xODAzOSBsIC0xLjA1ODMzLC0wLjE4Mzg3IHYgNC4xMDUwMSA0LjEwNTAxIGggLTQuMjMzMzMgLTQuMjMzMzQgdiAtNC4xMDUwMSAtNC4xMDUwMSBsIC0xLjA1ODMzLDAuMTgzODcgYyAtMC41ODIwOCwwLjEwMTEzIC0yLjQyOTU5LDAuNjMyMyAtNC4xMDU1OCwxLjE4MDM5IC04Ljc2NDM2NCwyLjg2NjE1IC0xNS43NDkwMzMsOS44NTA4MiAtMTguNjE1MTg0LDE4LjYxNTE4MSAtMC41NDgwODYsMS42NzU5OSAtMS4wNzkyNjEsMy41MjM1IC0xLjE4MDM4OSw0LjEwNTU4IGwgLTAuMTgzODY4LDEuMDU4MzMgaCA0LjEwNTAxIDQuMTA1MDExIHYgNC4yMzMzNCA0LjIzMzMzIGggLTQuMTA1MDExIC00LjEwNTAxIGwgMC4xODM4NjgsMS4wNTgzMyBjIDAuNzAyMTUxLDQuMDQxNTIgMy4yMjcyMTQsOS41MzQyNiA2LjA4NzExMSwxMy4yNDEyMiAyLjcwMjA2MSwzLjUwMjM3IDcuNzYzMTUyLDcuMjYwNTkgMTEuOTU3NTEyLDguODc5MjkgMi4xMTczNSwwLjgxNzEzIDUuNzczMDIsMS44ODg2NCA2LjU2MjA5LDEuOTIzNCAwLjI2NjcxLDAuMDExOCAwLjM1Mjc3LC0wLjk4Mjc3IDAuMzUyNzcsLTQuMDc2NjkgeiBtIDEuNzIzOTEsLTEyLjg2NDE0IGMgLTYuNDEwNDMsLTEuMjU4OTMgLTExLjAyNTcwOSwtNy44NTg0MSAtOS45NjYzOTksLTE0LjI1MTE0IDAuOTE3NDI5LC01LjUzNjQ5IDUuMDgyOTM5LC05LjcwMiAxMC42MTk0MjksLTEwLjYxOTQzIDguMTYwNzQsLTEuMzUyMjggMTUuNjg0NSw2LjE3MTQ4IDE0LjMzMjIyLDE0LjMzMjIzIC0xLjE5MTYsNy4xOTEwOCAtNy45MjM0MSwxMS45MjUyMSAtMTQuOTg1MjUsMTAuNTM4MzQgeiBNIDc0LjI0MDA5OCwxMDcuODgwNzQgYyAwLjkzMDE0NiwtNS4xMDcxMSAzLjEzMTg5MSwtMTAuNDE0OTExIDYuMTYyMTg1LC0xNC44NTUzMzEgMS44ODI5ODcsLTIuNzU5MjMgNi43OTM0MTEsLTcuNjY5NjUgOS41NTI2MzQsLTkuNTUyNjQgNC40NDA0MjIsLTMuMDMwMjkgOS43NDgyMjIsLTUuMjMyMDMgMTQuODU1MzMzLC02LjE2MjE4IGwgMi42MTA1NSwtMC40NzU0NiB2IC04LjQ2NzI3IC04LjQ2NzI3NCBsIC0yLjA0NjExLDAuMjAwMDc3IEMgOTUuODU0Nzc4LDYxLjAzMTU2IDg1LjU0NDg0OSw2NS4yODYwNzYgNzcuNjk3NzM4LDcxLjUyMTg4OSA2Ni4wOTE5NTksODAuNzQ0NTc5IDU4LjM5NDA3Niw5NC40OTcwOTkgNTcuMDMwMTcyLDEwOC40NDUxOCBsIC0wLjIwMDA3OCwyLjA0NjExIGggOC40NjcyNzUgOC40NjcyNzQgeiBtIDkyLjAzODAwMiwwLjU2NDQ0IEMgMTY0LjkxNDIsOTQuNDk3MDk5IDE1Ny4yMTYzMSw4MC43NDQ1NzkgMTQ1LjYxMDU0LDcxLjUyMTg4OSAxMzcuNzYzNDIsNjUuMjg2MDc2IDEyNy40NTM0OSw2MS4wMzE1NiAxMTcuOTMzNTgsNjAuMTAwNjYyIGwgLTIuMDQ2MTEsLTAuMjAwMDc3IHYgOC40NjcyNzQgOC40NjcyNyBsIDIuNjEwNTYsMC40NzU0NiBjIDUuMTA3MSwwLjkzMDE1IDEwLjQxNDksMy4xMzE4OSAxNC44NTUzMyw2LjE2MjE4IDIuNzU5MjIsMS44ODI5OSA3LjY2OTY0LDYuNzkzNDEgOS41NTI2Myw5LjU1MjY0IDMuMDMwMjksNC40NDA0MiA1LjIzMjA0LDkuNzQ4MjIxIDYuMTYyMTgsMTQuODU1MzMxIGwgMC40NzU0NiwyLjYxMDU1IGggOC40NjcyNyA4LjQ2NzI4IHpcIlxyXG4gICAgICAvPlxyXG4gICAgPC9nPlxyXG4gIDwvc3ZnPmA7XHJcblxyXG4gICAgdGhpcy5tZW51RWwuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIHN2Zyk7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZUlucHV0KCkge1xyXG4gICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xyXG4gICAgICBpZiAoZS50YXJnZXQudmFsdWUgJiYgZG9jdW1lbnQuY29udGFpbnModGhpcy5tZW51RXJyb3JFbCkpXHJcbiAgICAgICAgdGhpcy5maWVsZEVsLnJlbW92ZUNoaWxkKHRoaXMubWVudUVycm9yRWwpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNZW51VmlldztcclxuIiwiY2xhc3MgTW9kYWxWaWV3IHtcclxuICBtb2RhbEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbFwiKTtcclxuICByZXN1bHRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzdWx0XCIpO1xyXG4gIGRlc2NFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY1wiKTtcclxuICByZXN0YXJ0QnRuRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3RhcnRcIik7XHJcblxyXG4gIHRvZ2dsZU1vZGFsKCkge1xyXG4gICAgdGhpcy5tb2RhbEVsLmNsYXNzTGlzdC50b2dnbGUoXCJoaWRkZW5cIik7XHJcbiAgfVxyXG5cclxuICBhbmltYXRlTW9kYWwoKSB7XHJcbiAgICB0aGlzLm1vZGFsRWwuY2xhc3NMaXN0LnRvZ2dsZShcIm9wYXF1ZVwiKTtcclxuICB9XHJcblxyXG4gIHJlbmRlckdhbWVSZXN1bHQobmFtZSkge1xyXG4gICAgdGhpcy5yZXN1bHRFbC50ZXh0Q29udGVudCA9IG5hbWUgPT09IFwiY29tcHV0ZXJcIiA/IFwiRGVmZWF0IVwiIDogXCJWaWN0b3J5IVwiO1xyXG4gICAgdGhpcy5kZXNjRWwudGV4dENvbnRlbnQgPSBgJHtuYW1lfSBoYXMgd29uIWA7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrUmVzdGFydEJ0bihjYikge1xyXG4gICAgdGhpcy5yZXN0YXJ0QnRuRWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNiKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUNsaWNrUmVzdGFydEJ0bihjYikge1xyXG4gICAgdGhpcy5yZXN0YXJ0QnRuRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1vZGFsVmlldztcclxuIiwiZXhwb3J0IGNvbnN0IFNISVBfU0laRVMgPSBbNCwgNCwgMywgMywgMiwgMiwgMSwgMV07XHJcblxyXG5leHBvcnQgY29uc3QgQ1VTVE9NX0FMUEhBQkVUID0gXCIxMjM0NTY3ODkwYWJjZGVmXCI7XHJcbmV4cG9ydCBjb25zdCBTSVpFX0lEID0gMTA7XHJcblxyXG5leHBvcnQgY29uc3QgSE9SSVpPTlRBTCA9IFwiaG9yaXpvbnRhbFwiO1xyXG5leHBvcnQgY29uc3QgVkVSVElDQUwgPSBcInZlcnRpY2FsXCI7XHJcblxyXG5leHBvcnQgY29uc3QgVElNRV9PVVQgPSAxO1xyXG5leHBvcnQgY29uc3QgVElNRV9ERUxBWSA9IDAuMzU7XHJcbiIsImNvbnN0IGNvbmNhdE51bWJlcnMgPSAocG9zKSA9PiB7XHJcbiAgY29uc3QgeyBwb3NBLCBwb3NCIH0gPSBwb3M7XHJcblxyXG4gIGNvbnN0IHN0ciA9IFwiXCIgKyBwb3NBICsgcG9zQjtcclxuXHJcbiAgcmV0dXJuIE51bWJlcihzdHIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGJpbmFyeVNlYXJjaCA9IGZ1bmN0aW9uIChhcnIsIGluZGV4KSB7XHJcbiAgbGV0IGxlZnQgPSAwO1xyXG4gIGxldCByaWdodCA9IGFyci5sZW5ndGggLSAxO1xyXG4gIGxldCBtaWQ7XHJcblxyXG4gIGNvbnN0IGluZGV4TnVtYmVyID0gY29uY2F0TnVtYmVycyhpbmRleCk7XHJcblxyXG4gIHdoaWxlIChyaWdodCA+PSBsZWZ0KSB7XHJcbiAgICBtaWQgPSBsZWZ0ICsgTWF0aC5mbG9vcigocmlnaHQgLSBsZWZ0KSAvIDIpO1xyXG5cclxuICAgIC8vIGlmIHRoZSBlbGVtZW50IGlzIHByZXNlbnQgYXQgdGhlIG1pZGRsZSBpdHNlZlxyXG5cclxuICAgIGNvbnN0IG1pZE51bWJlciA9IGNvbmNhdE51bWJlcnMoYXJyW21pZF0pO1xyXG4gICAgaWYgKG1pZE51bWJlciA9PT0gaW5kZXhOdW1iZXIpIHJldHVybiBtaWQ7XHJcblxyXG4gICAgLy8gaWYgZWxlbWVudCBpcyBzbWFsbGVkIHRoZW4gbWlkLCB0aGVuXHJcbiAgICAvLyBpdCBjYW4gb25seSBiZSBwcmVzZW50IGluIHRoZSBsZWZ0IHN1YmFhcmF5XHJcbiAgICBpZiAobWlkTnVtYmVyID4gaW5kZXhOdW1iZXIpIHJpZ2h0ID0gbWlkIC0gMTtcclxuICAgIC8vIG90aGVyd2lzZSB0aGUgZWxlbWVudCBjYW4gb25seSBiZSBwcmVzZW50XHJcbiAgICAvLyBpbiB0aGUgcmlnaHQgc3ViYXJyYXlcclxuICAgIGVsc2UgbGVmdCA9IG1pZCArIDE7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gLTE7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UmFuZG9tTnVtYmVyID0gKG1heCkgPT4ge1xyXG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHNsZWVwID0gKHMpID0+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgcyAqIDEwMDApKTtcclxuICAvLyByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAvLyAgIHNldFRpbWVvdXQoKCkgPT4ge30sIHMpO1xyXG4gIC8vIH0pO1xyXG59O1xyXG4iLCJleHBvcnQgeyB1cmxBbHBoYWJldCB9IGZyb20gJy4vdXJsLWFscGhhYmV0L2luZGV4LmpzJ1xuZXhwb3J0IGxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcbmV4cG9ydCBsZXQgY3VzdG9tUmFuZG9tID0gKGFscGhhYmV0LCBkZWZhdWx0U2l6ZSwgZ2V0UmFuZG9tKSA9PiB7XG4gIGxldCBtYXNrID0gKDIgPDwgKE1hdGgubG9nKGFscGhhYmV0Lmxlbmd0aCAtIDEpIC8gTWF0aC5MTjIpKSAtIDFcbiAgbGV0IHN0ZXAgPSAtfigoMS42ICogbWFzayAqIGRlZmF1bHRTaXplKSAvIGFscGhhYmV0Lmxlbmd0aClcbiAgcmV0dXJuIChzaXplID0gZGVmYXVsdFNpemUpID0+IHtcbiAgICBsZXQgaWQgPSAnJ1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc3RlcClcbiAgICAgIGxldCBqID0gc3RlcFxuICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdIHx8ICcnXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IHNpemUpIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZXhwb3J0IGxldCBjdXN0b21BbHBoYWJldCA9IChhbHBoYWJldCwgc2l6ZSA9IDIxKSA9PlxuICBjdXN0b21SYW5kb20oYWxwaGFiZXQsIHNpemUsIHJhbmRvbSlcbmV4cG9ydCBsZXQgbmFub2lkID0gKHNpemUgPSAyMSkgPT5cbiAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShzaXplKSkucmVkdWNlKChpZCwgYnl0ZSkgPT4ge1xuICAgIGJ5dGUgJj0gNjNcbiAgICBpZiAoYnl0ZSA8IDM2KSB7XG4gICAgICBpZCArPSBieXRlLnRvU3RyaW5nKDM2KVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA8IDYyKSB7XG4gICAgICBpZCArPSAoYnl0ZSAtIDI2KS50b1N0cmluZygzNikudG9VcHBlckNhc2UoKVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA+IDYyKSB7XG4gICAgICBpZCArPSAnLSdcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgKz0gJ18nXG4gICAgfVxuICAgIHJldHVybiBpZFxuICB9LCAnJylcbiIsImV4cG9ydCBjb25zdCB1cmxBbHBoYWJldCA9XG4gICd1c2VhbmRvbS0yNlQxOTgzNDBQWDc1cHhKQUNLVkVSWU1JTkRCVVNIV09MRl9HUVpiZmdoamtscXZ3eXpyaWN0J1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgaW5pdCBmcm9tIFwiLi9qcy9tb2R1bGVzL2NvbnRyb2xsZXJcIjtcclxuaW1wb3J0IFwiLi9zYXNzL21haW4uc2Nzc1wiO1xyXG5cclxuY29uc29sZS5sb2coXCJoZWxsb1wiKTtcclxuaW5pdCgpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=