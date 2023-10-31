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

  modalView.toggleModal();
  await (0,_utils_helpers__WEBPACK_IMPORTED_MODULE_0__.sleep)(0.5);
  modalView.animateModal();
  gameplayView.clearPlayerTurn();
  gameplayView.clearCurrentResetBtn();
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
  ///////////////////////////////
  gameplayView.renderCurrentResetBtn(resetCurrentGame);
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

const resetCurrentGame = () => {
  if (game.getTimer() || game.getDelay() || !game.userPlaying()) return;
  if (!(0,_utils_helpers__WEBPACK_IMPORTED_MODULE_0__.confirmCurrentResetGame)()) {
    return;
  }
  game.restartGame();
  gameplayView.renderGameplay(game.getPlayers());
  gameplayView.renderShipPick(game.getShipPick());
  gameplayView.clearCurrentResetBtn();
  gameplayView.clearPlayerTurn();
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
  resetCurrentGame;

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
  renderGameElement(html) {
    this.gameEl.insertAdjacentHTML("beforeend", html);
  }

  renderPlayerTurn(name) {
    const html = `<div class="game-turn">
    <div class="game-current-name opaque">${name}'s turn</div>
  </div>`;
    this.renderGameElement(html);
    // this.gameEl.insertAdjacentHTML("afterbegin", html);
  }

  renderCurrentResetBtn(cb) {
    const html = `<div class="game-reset">
    <button id="reset-current-game" class="btn-main" >
    restart game
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        width="100px"
        height="100px"
      >
        <path
          d="M 25 2 A 2.0002 2.0002 0 1 0 25 6 C 35.517124 6 44 14.482876 44 25 C 44 35.517124 35.517124 44 25 44 C 14.482876 44 6 35.517124 6 25 C 6 19.524201 8.3080175 14.608106 12 11.144531 L 12 15 A 2.0002 2.0002 0 1 0 16 15 L 16 4 L 5 4 A 2.0002 2.0002 0 1 0 5 8 L 9.5253906 8 C 4.9067015 12.20948 2 18.272325 2 25 C 2 37.678876 12.321124 48 25 48 C 37.678876 48 48 37.678876 48 25 C 48 12.321124 37.678876 2 25 2 z"
        ></path>
      </svg>
    </button>
  </div>`;
    this.renderGameElement(html);
    this.resetCurrentGame = document.getElementById("reset-current-game");
    this.resetCurrentGame.addEventListener("click", cb);
  }

  clearCurrentResetBtn() {
    const resetCurrentGameEl = this.gameEl.querySelector(".game-reset");
    this.gameEl.removeChild(resetCurrentGameEl);
    this.resetCurrentGame = null;
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
/* harmony export */   confirmCurrentResetGame: () => (/* binding */ confirmCurrentResetGame),
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

const confirmCurrentResetGame = () => {
  return confirm("Are you sure you want to restart the game?");
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



(0,_js_modules_controller__WEBPACK_IMPORTED_MODULE_0__["default"])();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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YyxhQUFhO0FBQzNCLGNBQWMsV0FBVztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxhQUFhO0FBQ3pCO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsYUFBYTtBQUMzQixjQUFjLFlBQVk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFlLFlBQVksRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDaFk1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxRQUFRLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ3RFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsTUFBTTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1QmxCO0FBQ1A7QUFDTztBQUNBO0FBQ1A7QUFDTztBQUNBO0FBQ1A7QUFDTztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUUDtBQUNBLFVBQVUsYUFBYTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsTUFBTTtBQUNOO0FBQ0E7QUFDTztBQUNQO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0NxRDtBQUM5QztBQUNBO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7Ozs7Ozs7Ozs7Ozs7OztBQ2hDSTtBQUNQOzs7Ozs7O1VDREE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOMkM7QUFDakI7QUFDMUI7QUFDQSxrRUFBSSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9zYXNzL21haW4uc2Nzcz9hNGU2Iiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9qcy9tb2R1bGVzL2NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2pzL21vZHVsZXMvbW9kZWwvZ2FtZWJvYXJkL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvanMvbW9kdWxlcy9tb2RlbC9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvanMvbW9kdWxlcy9tb2RlbC9wbGF5ZXJzL2NvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9qcy9tb2R1bGVzL21vZGVsL3BsYXllcnMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9qcy9tb2R1bGVzL21vZGVsL3BsYXllcnMvdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvanMvbW9kdWxlcy9tb2RlbC9xdWV1ZS9xdWV1ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvanMvbW9kdWxlcy9tb2RlbC9zaGlwUG9zaXRpb24vc2hpcFBvc2l0aW9uLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9qcy9tb2R1bGVzL21vZGVsL3NoaXAvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvanMvbW9kdWxlcy92aWV3L2dhbWVwbGF5Vmlldy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvanMvbW9kdWxlcy92aWV3L21lbnVWaWV3LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9qcy9tb2R1bGVzL3ZpZXcvbW9kYWxWaWV3LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9qcy91dGlscy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2pzL3V0aWxzL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vbm9kZV9tb2R1bGVzL25hbm9pZC9pbmRleC5icm93c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL25vZGVfbW9kdWxlcy9uYW5vaWQvdXJsLWFscGhhYmV0L2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgeyBjb25maXJtQ3VycmVudFJlc2V0R2FtZSwgc2xlZXAgfSBmcm9tIFwiLi4vdXRpbHMvaGVscGVyc1wiO1xyXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9tb2RlbFwiO1xyXG5pbXBvcnQgR2FtZXBsYXlWaWV3IGZyb20gXCIuL3ZpZXcvZ2FtZXBsYXlWaWV3XCI7XHJcbmltcG9ydCBNZW51VmlldyBmcm9tIFwiLi92aWV3L21lbnVWaWV3XCI7XHJcbmltcG9ydCBNb2RhbFZpZXcgZnJvbSBcIi4vdmlldy9tb2RhbFZpZXdcIjtcclxuXHJcbmNvbnN0IG1lbnVWaWV3ID0gbmV3IE1lbnVWaWV3KCk7XHJcbmNvbnN0IGdhbWVwbGF5VmlldyA9IG5ldyBHYW1lcGxheVZpZXcoKTtcclxuY29uc3QgbW9kYWxWaWV3ID0gbmV3IE1vZGFsVmlldygpO1xyXG5jb25zdCBnYW1lID0gbmV3IEdhbWUoKTtcclxuXHJcbmNvbnN0IHJlc2V0R2FtZWJvYXJkID0gKCkgPT4ge1xyXG4gIGNvbnN0IHVzZXIgPSBnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKTtcclxuXHJcbiAgdXNlci5jbGVhclBsYXllckJvYXJkKCk7XHJcbiAgZ2FtZS5hZGRRdWV1ZVNoaXBzKCk7XHJcbiAgZ2FtZXBsYXlWaWV3LmhpZGVQbGF5QnV0dG9uKCk7XHJcbiAgZ2FtZXBsYXlWaWV3LnJlbmRlckdhbWVib2FyZFJhbmRvbSh1c2VyLmdldFBsYXllckJvYXJkKCkpO1xyXG4gIGdhbWVwbGF5Vmlldy5yZW5kZXJTaGlwUGljayhnYW1lLmdldFNoaXBQaWNrKCkpO1xyXG59O1xyXG5cclxuY29uc3QgYWRkU2hpcFBvc2l0aW9uUmFuZG9tID0gKCkgPT4ge1xyXG4gIGNvbnN0IHVzZXIgPSBnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKTtcclxuXHJcbiAgdXNlci5hZGRSYW5kb21TaGlwc1Bvc2l0aW9uKCk7XHJcblxyXG4gIGdhbWVwbGF5Vmlldy5yZW5kZXJHYW1lYm9hcmRSYW5kb20odXNlci5nZXRQbGF5ZXJCb2FyZCgpKTtcclxuICBpZiAoIWdhbWUuZW1wdHlRdWV1ZSgpKSB7XHJcbiAgICBnYW1lLmNsZWFyUXVldWVTaGlwKCk7XHJcbiAgICBnYW1lcGxheVZpZXcuaGlkZVNoaXBQaWNrKCk7XHJcbiAgICBnYW1lcGxheVZpZXcuc2hvd1BsYXlCdXR0b24oKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBhZGRTaGlwUG9zaXRpb24gPSAoZGF0YSkgPT4ge1xyXG4gIGNvbnN0IHsgcG9zQSwgcG9zQiB9ID0gZGF0YTtcclxuICBjb25zdCB1c2VyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XHJcbiAgbGV0IHNoaXAgPSBnYW1lLmdldFF1ZXVlU2hpcCgpO1xyXG5cclxuICBjb25zdCBvbkJvYXJkID0gdXNlci5hZGRTaGlwT25QbGF5ZXJHYW1lYm9hcmQocG9zQSwgcG9zQiwgc2hpcCk7XHJcblxyXG4gIGlmICghb25Cb2FyZCkgcmV0dXJuO1xyXG5cclxuICBnYW1lcGxheVZpZXcucmVuZGVyR2FtZWJvYXJkU2hpcChkYXRhLCBzaGlwKTtcclxuICBnYW1lLmRlcXVlU2hpcCgpO1xyXG4gIGdhbWVwbGF5Vmlldy5yZW5kZXJTaGlwUGljayhnYW1lLmdldFNoaXBQaWNrKCkpO1xyXG59O1xyXG5cclxuY29uc3QgY2hhbmdlU2hpcERpcmVjdGlvbiA9ICgpID0+IHtcclxuICBnYW1lLmNoYW5nZUdhbWVib2FyZERpcmVjdGlvbigpO1xyXG4gIGdhbWVwbGF5Vmlldy5yZW5kZXJTaGlwUGljayhnYW1lLmdldFNoaXBQaWNrKCkpO1xyXG59O1xyXG5cclxuY29uc3QgcGxheUNvbXB1dGVyVHVybiA9ICgpID0+IHtcclxuICAvLyByZW1lbWJlciBub3cgdGhhdCBwbGF5ZXJzIGFyZSBzd2l0Y2hlZFxyXG4gIC8vIG5vdyBjdXJyZW50IHBsYXllciBpcyBDb21wdXRlciBwbGF5ZXIgISEhIVxyXG4gIC8vIG5vdyBlbmVteSBpcyB1c2VyIHBsYXllciAhISFcclxuICBjb25zdCBjb21wdXRlciA9IGdhbWUuZ2V0Q3VycmVudFBsYXllcigpO1xyXG4gIGNvbnN0IHJhbmRvbVBvc2l0aW9uID0gY29tcHV0ZXIuZ2V0RW5lbXlQb3NpdGlvbkJvYXJkKCk7XHJcbiAgYXR0YWNrR2FtZWJvYXJkKHJhbmRvbVBvc2l0aW9uKTtcclxufTtcclxuXHJcbi8vIGZ1bmN0aW9uIHNob3cgbW9kYWwgd2luZG93IHdoZW4gcGxheWVyIHN1bmsgYWxsIHNoaXBzXHJcbmNvbnN0IGVuZEdhbWUgPSBhc3luYyAoKSA9PiB7XHJcbiAgZ2FtZXBsYXlWaWV3LnJlbW92ZUNsaWNrQ29tcHV0ZXJHYW1lYm9hcmQocGxheUdhbWUpO1xyXG4gIG1vZGFsVmlldy5yZW5kZXJHYW1lUmVzdWx0KGdhbWUuZ2V0Q3VycmVudE5hbWUoKSk7XHJcblxyXG4gIG1vZGFsVmlldy50b2dnbGVNb2RhbCgpO1xyXG4gIGF3YWl0IHNsZWVwKDAuNSk7XHJcbiAgbW9kYWxWaWV3LmFuaW1hdGVNb2RhbCgpO1xyXG4gIGdhbWVwbGF5Vmlldy5jbGVhclBsYXllclR1cm4oKTtcclxuICBnYW1lcGxheVZpZXcuY2xlYXJDdXJyZW50UmVzZXRCdG4oKTtcclxufTtcclxuXHJcbi8vIGZ1bmN0aW9uIHVwZGF0ZSBnYW1lIHN0YXRlXHJcbmNvbnN0IHVwZGF0ZUdhbWUgPSBhc3luYyAoc2hpcCkgPT4ge1xyXG4gIC8vIGNoZWNrIGlmIHNoaXAgZXhpc3RzIG9uIGNlbGwsXHJcbiAgaWYgKCFzaGlwKSB7XHJcbiAgICBnYW1lLnN3aXRjaFBsYXllcnMoKTtcclxuICAgIGdhbWVwbGF5Vmlldy5oaWRlUGxheWVyVHVybigpO1xyXG4gICAgZ2FtZXBsYXlWaWV3LnN3aXRjaEdhbWVQYW5lbCgpO1xyXG4gICAgYXdhaXQgc2xlZXAoMC4xNSk7XHJcbiAgICBnYW1lcGxheVZpZXcuY2hhbmdlUGxheWVyVHVybihnYW1lLmdldEN1cnJlbnROYW1lKCkpO1xyXG5cclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGN1cnJlbnRQbGF5ZXIgPSBnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKTtcclxuICBjb25zdCBlbmVteVBsYXllciA9IGdhbWUuZ2V0RW5lbXlQbGF5ZXIoKTtcclxuXHJcbiAgaWYgKCFnYW1lLnVzZXJQbGF5aW5nKCkpIHtcclxuICAgIC8vIHdlIHNldCB0cnVlIHJhbmRvbSBwb3NpdGlvbiBhcm91bmQgdGFyZ2V0IHNoaXBcclxuICAgIGN1cnJlbnRQbGF5ZXIuc2VsZWN0U2hpcEhpdHRpbmcoKTtcclxuICB9XHJcblxyXG4gIC8vIGNoZWNrIGlmIHRhcmdldFNoaXAgaXMgZnVsbCBTdW5rXHJcbiAgaWYgKHNoaXAuZ2V0U3VuaygpKSB7XHJcbiAgICAvLyBjaGVjayBhY3Rpb24gZm9yIGNvbXB1dGVyIHBsYXlcclxuICAgIGlmICghZ2FtZS51c2VyUGxheWluZygpKSB7XHJcbiAgICAgIGN1cnJlbnRQbGF5ZXIuZGVzZWxlY3RTaGlwSGl0dGluZygpOyAvL2FmdGVyIHVuY2hlY2tpbmcgdGhlc2Ugc2V0dGluZ3Mgd2UgZHJhdyByYW5kb20gcG9zaXRpb24gb24gYm9hcmRcclxuICAgICAgY3VycmVudFBsYXllci5jbGVhclBvdGVudGlhbFNoaXBQb3NpdGlvbnMoKTsgLy8gd2Ugbm90IG5lZWQgcG90ZW50aWFsIHBvc2l0aW9uIGFmdGVyIHN1bmsgc2hpcCBhcm91bmQgc2hpcCBmaWVsZHMgb24gZW5lbXkgYm9hcmRcclxuICAgICAgLy8gd2UgcmVtb3ZlIGFsc28gcmVzZXJ2ZWQgcG9zaXRpb25zIGFyb3VuZCBzaGlwIGZpZWxkcyBmcm9tIHBvdGVudGlhbCBjb21wdXRlciBwb3NpdGlvbnNcclxuICAgICAgY3VycmVudFBsYXllci5jbGVhclJlc2VydmVkUG9zaXRpb25zKHNoaXAuZ2V0UmVzZXJ2ZWRQb3NpdGlvbnMoKSk7XHJcbiAgICB9XHJcbiAgICBlbmVteVBsYXllci5pbmNyZWFzZVN1bmtlblNoaXBzKCk7XHJcbiAgICAvLyBzZXQgcmVzZXJ2ZWQgY2VsbHMgYXMgbWFya2VkXHJcbiAgICBlbmVteVBsYXllci5hZGRSZXNlcnZlZFNoaXBQb3NpdGlvbnMoc2hpcC5nZXRSZXNlcnZlZFBvc2l0aW9ucygpKTtcclxuXHJcbiAgICAvLyByZW5kZXIgcmVzZXJ2ZWQgY2VsbHMgb24gZ2FtZWJvYXJkIGVsZW1lbnRcclxuICAgIGdhbWVwbGF5Vmlldy5yZW5kZXJSZXNlcnZlZFBvc2l0aW9ucyhcclxuICAgICAgZW5lbXlQbGF5ZXIuZ2V0VHlwZSgpLFxyXG4gICAgICBzaGlwLmdldFJlc2VydmVkUG9zaXRpb25zKClcclxuICAgICk7XHJcblxyXG4gICAgLy8gcmVuZGVyIHN1bmsgc2hpcCBvbiBzaGlwIGxpc3QgZWxlbWVudFxyXG4gICAgZ2FtZXBsYXlWaWV3LnJlbmRlclN1bmtTaGlwKHNoaXAuZ2V0SUQoKSk7XHJcbiAgICAvLyBnYW1lcGxheVZpZXcucmVuZGVyU3Vua1NoaXAoZW5lbXlQbGF5ZXIpO1xyXG4gIH1cclxuICAvLyBjaGVjayBpZiBhbGwgZW5lbXkgc2hpcHMgYXJlIHN1bmtlblxyXG4gIGlmIChlbmVteVBsYXllci5hbGxTdW5rZW5TaGlwcygpKSB7XHJcbiAgICBlbmRHYW1lKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgYXR0YWNrR2FtZWJvYXJkID0gYXN5bmMgKHBvc2l0aW9uKSA9PiB7XHJcbiAgLy8gY29uc3QgcG9zaXRpb24gPSBnYW1lcGxheVZpZXcuZ2V0Q29tcHV0ZXJCb2FyZFBvc2l0aW9uKGV2ZW50KTtcclxuICAvLyBpZiAoIXBvc2l0aW9uKSByZXR1cm47XHJcblxyXG4gIGlmIChnYW1lLmdldFRpbWVyKCkpIHJldHVybjtcclxuXHJcbiAgLy8gZ2V0IGN1cnJlbnQgYW5kIGVuZW15IHBsYXllcnNcclxuICBjb25zdCBjdXJyZW50UGxheWVyID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyKCk7XHJcbiAgY29uc3QgZW5lbXlQbGF5ZXIgPSBnYW1lLmdldEVuZW15UGxheWVyKCk7XHJcblxyXG4gIC8vIGdldCBwb3NpdGlvbiBvZiBlbmVteSBjZWxsIGZyb20gZ2FtZWJvYXJkO1xyXG4gIGNvbnN0IGVuZW15Q2VsbCA9IGN1cnJlbnRQbGF5ZXIuYXR0YWNrRW5lbXlHYW1lYm9hcmQocG9zaXRpb24sIGVuZW15UGxheWVyKTtcclxuXHJcbiAgLy8gY2hlY2sgaWYgZW5lbXlDZWxsIGlzIG1hcmtlZCBvciBoaXRcclxuICBpZiAoIWVuZW15Q2VsbCkgcmV0dXJuO1xyXG5cclxuICAvLyBzaGlwIG9iamVjdCBmcm9tIGJvYXJkIGFycmF5XHJcbiAgY29uc3Qgc2hpcCA9IGVuZW15Q2VsbC5zaGlwQ2VsbDtcclxuXHJcbiAgLy8gcmVuZGVyIG1hcmsgb24gdGFyZ2V0IGNlbGxcclxuICBnYW1lcGxheVZpZXcucmVuZGVyTWFya2VkQ2VsbChwb3NpdGlvbiwgc2hpcCwgZW5lbXlQbGF5ZXIuZ2V0VHlwZSgpKTtcclxuXHJcbiAgLy8gdXBkYXRlIGdhbWUgc3RhdGVcclxuICB1cGRhdGVHYW1lKHNoaXApO1xyXG4gIC8vIHN0b3AgdHVybiB3aGVuIGN1cnJlbnQgcGxheWVyIGlzIHVzZXIgb3IgZ2FtZSBpcyBvdmVyXHJcbiAgaWYgKGdhbWUudXNlclBsYXlpbmcoKSB8fCBnYW1lLnN0b3BQbGF5aW5nKCkpIHJldHVybjtcclxuICBnYW1lLnNldFRpbWVyKHBsYXlDb21wdXRlclR1cm4pO1xyXG59O1xyXG5cclxuLy8gZnVuY3Rpb24gbWFrZSBnYW1lcGxheSBiZXR3ZWVuIHVzZXIgYW5kIGNvbXB1dGVyXHJcbmNvbnN0IHBsYXlHYW1lID0gKGV2ZW50KSA9PiB7XHJcbiAgaWYgKGdhbWUuZ2V0VGltZXIoKSB8fCBnYW1lLmdldERlbGF5KCkgfHwgIWdhbWUudXNlclBsYXlpbmcoKSkgcmV0dXJuO1xyXG4gIGNvbnN0IHBvc2l0aW9uID0gZ2FtZXBsYXlWaWV3LmdldENvbXB1dGVyQm9hcmRQb3NpdGlvbihldmVudCk7XHJcbiAgaWYgKCFwb3NpdGlvbikgcmV0dXJuO1xyXG4gIGF0dGFja0dhbWVib2FyZChwb3NpdGlvbik7XHJcbn07XHJcblxyXG5jb25zdCBydW5HYW1lID0gKCkgPT4ge1xyXG4gIGNvbnN0IHVzZXIgPSBnYW1lLmdldEN1cnJlbnRQbGF5ZXIoKTtcclxuICBjb25zdCBjb21wdXRlciA9IGdhbWUuZ2V0RW5lbXlQbGF5ZXIoKTtcclxuICBjb21wdXRlci5hZGRSYW5kb21TaGlwc1Bvc2l0aW9uKCk7XHJcbiAgY29tcHV0ZXIuYWRkR2FtZWJvYXJkUG9zaXRpb25zKHVzZXIuZ2V0UGxheWVyQm9hcmQoKSk7XHJcblxyXG4gIGdhbWUuY2xlYXJRdWV1ZVNoaXAoKTtcclxuICBnYW1lcGxheVZpZXcuaGlkZVBsYXlCdXR0b24oKTtcclxuICBnYW1lcGxheVZpZXcucmVuZGVyUGxheWVyVHVybih1c2VyLmdldE5hbWUoKSk7XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIGdhbWVwbGF5Vmlldy5yZW5kZXJDdXJyZW50UmVzZXRCdG4ocmVzZXRDdXJyZW50R2FtZSk7XHJcbiAgZ2FtZXBsYXlWaWV3LnN3aXRjaEdhbWVQYW5lbCgpO1xyXG4gIGdhbWVwbGF5Vmlldy5vbkNsaWNrQ29tcHV0ZXJHYW1lYm9hcmQocGxheUdhbWUpO1xyXG59O1xyXG5cclxuY29uc3Qgc3RhcnRHYW1lID0gKG5hbWUpID0+IHtcclxuICBpZiAoIW5hbWUpIHtcclxuICAgIG1lbnVWaWV3LnNob3dFcnJvcigpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBjb25zdCBwbGF5ZXJzID0gZ2FtZS5nZXRQbGF5ZXJzKCk7XHJcbiAgY29uc3QgcGxheWVyR2FtZWJvYXJkID0gZ2FtZS5nZXRDdXJyZW50UGxheWVyR2FtZWJvYXJkKCk7XHJcbiAgY29uc3Qgc2hpcFBpY2sgPSBnYW1lLmdldFNoaXBQaWNrKCk7XHJcblxyXG4gIGdhbWUuc2V0VXNlclBsYXllck5hbWUobmFtZSk7XHJcblxyXG4gIGdhbWVwbGF5Vmlldy5yZW5kZXJHYW1lcGxheShwbGF5ZXJzKTtcclxuICBnYW1lcGxheVZpZXcucmVuZGVyU2hpcFBpY2soc2hpcFBpY2spO1xyXG5cclxuICBnYW1lcGxheVZpZXcub25DbGlja1NoaXBFbChjaGFuZ2VTaGlwRGlyZWN0aW9uKTtcclxuICBnYW1lcGxheVZpZXcub25EcmFnU2hpcEVsKHBsYXllckdhbWVib2FyZCk7XHJcbiAgZ2FtZXBsYXlWaWV3Lm9uRHJvcFNoaXBFbChhZGRTaGlwUG9zaXRpb24pO1xyXG5cclxuICBnYW1lcGxheVZpZXcub25DbGlja1JhbmRvbUJ0bihhZGRTaGlwUG9zaXRpb25SYW5kb20pO1xyXG4gIGdhbWVwbGF5Vmlldy5vbkNsaWNrUmVzZXRCdG4ocmVzZXRHYW1lYm9hcmQpO1xyXG4gIGdhbWVwbGF5Vmlldy5vbkNsaWNrUGxheUJ0bihydW5HYW1lKTtcclxuICBtZW51Vmlldy5oaWRlU3RhcnRNZW51KCk7XHJcbn07XHJcblxyXG5jb25zdCByZXNldEN1cnJlbnRHYW1lID0gKCkgPT4ge1xyXG4gIGlmIChnYW1lLmdldFRpbWVyKCkgfHwgZ2FtZS5nZXREZWxheSgpIHx8ICFnYW1lLnVzZXJQbGF5aW5nKCkpIHJldHVybjtcclxuICBpZiAoIWNvbmZpcm1DdXJyZW50UmVzZXRHYW1lKCkpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgZ2FtZS5yZXN0YXJ0R2FtZSgpO1xyXG4gIGdhbWVwbGF5Vmlldy5yZW5kZXJHYW1lcGxheShnYW1lLmdldFBsYXllcnMoKSk7XHJcbiAgZ2FtZXBsYXlWaWV3LnJlbmRlclNoaXBQaWNrKGdhbWUuZ2V0U2hpcFBpY2soKSk7XHJcbiAgZ2FtZXBsYXlWaWV3LmNsZWFyQ3VycmVudFJlc2V0QnRuKCk7XHJcbiAgZ2FtZXBsYXlWaWV3LmNsZWFyUGxheWVyVHVybigpO1xyXG59O1xyXG5cclxuY29uc3QgcmVzdGFydEdhbWUgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgZ2FtZS5yZXN0YXJ0R2FtZSgpO1xyXG4gIGdhbWVwbGF5Vmlldy5yZW5kZXJHYW1lcGxheShnYW1lLmdldFBsYXllcnMoKSk7XHJcbiAgZ2FtZXBsYXlWaWV3LnJlbmRlclNoaXBQaWNrKGdhbWUuZ2V0U2hpcFBpY2soKSk7XHJcbiAgbW9kYWxWaWV3LmFuaW1hdGVNb2RhbCgpO1xyXG4gIGF3YWl0IHNsZWVwKDAuNSk7XHJcbiAgbW9kYWxWaWV3LnRvZ2dsZU1vZGFsKCk7XHJcbn07XHJcblxyXG5jb25zdCBpbml0ID0gKCkgPT4ge1xyXG4gIG1lbnVWaWV3Lm9uQ2xpY2tTdGFydEJ1dHRvbihzdGFydEdhbWUpO1xyXG4gIG1vZGFsVmlldy5vbkNsaWNrUmVzdGFydEJ0bihyZXN0YXJ0R2FtZSk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBpbml0O1xyXG4iLCJpbXBvcnQgeyBIT1JJWk9OVEFMLCBWRVJUSUNBTCB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9jb25zdGFudHNcIjtcclxuaW1wb3J0IHsgZ2V0UmFuZG9tTnVtYmVyIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2hlbHBlcnNcIjtcclxuXHJcbmNsYXNzIEdhbWVib2FyZCB7XHJcbiAgc3RhdGljIG1heFNpemUgPSAxMDtcclxuICBib2FyZCA9IFtdO1xyXG5cclxuICBkaXJlY3Rpb25zID0gW0hPUklaT05UQUwsIFZFUlRJQ0FMXTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNyZWF0ZUdhbWVib2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0R2FtZWJvYXJkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYm9hcmQ7XHJcbiAgfVxyXG5cclxuICBnZXREaXJlY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb25zWzBdO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlRGlyZWN0aW9uKCkge1xyXG4gICAgY29uc3QgW2ZpcnN0LCBzZWNvbmRdID0gdGhpcy5kaXJlY3Rpb25zO1xyXG4gICAgdGhpcy5kaXJlY3Rpb25zID0gW3NlY29uZCwgZmlyc3RdO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJHYW1lYm9hcmQoKSB7XHJcbiAgICB0aGlzLmJvYXJkLmxlbmd0aCA9IDA7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVHYW1lYm9hcmQoKSB7XHJcbiAgICB0aGlzLmNsZWFyR2FtZWJvYXJkKCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IEdhbWVib2FyZC5tYXhTaXplOyBpKyspIHtcclxuICAgICAgdGhpcy5ib2FyZFtpXSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgR2FtZWJvYXJkLm1heFNpemU7IGkrKykge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IEdhbWVib2FyZC5tYXhTaXplOyBqKyspIHtcclxuICAgICAgICB0aGlzLmJvYXJkW2ldW2pdID0geyBzaGlwQ2VsbDogbnVsbCwgbWFya2VkOiBmYWxzZSwgcmVzZXJ2ZWQ6IGZhbHNlIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZFNoaXAocG9zQSwgcG9zQiwgc2hpcCkge1xyXG4gICAgc2hpcC5jbGVhclJlc2VydmVkUG9zaXRpb25zKCk7XHJcblxyXG4gICAgaWYgKFxyXG4gICAgICBwb3NBIDwgMCB8fFxyXG4gICAgICBwb3NBID49IEdhbWVib2FyZC5tYXhTaXplIHx8XHJcbiAgICAgIHBvc0IgPCAwIHx8XHJcbiAgICAgIHBvc0IgPj0gR2FtZWJvYXJkLm1heFNpemVcclxuICAgIClcclxuICAgICAgcmV0dXJuO1xyXG5cclxuICAgIC8vIGNoZWNrIGlmIGJvYXJkY2VsbCBpcyBoYXMgc2hpcCBvciByZXNlcnZlZCBwbGFjZVxyXG4gICAgaWYgKHRoaXMuYm9hcmRbcG9zQV1bcG9zQl0uc2hpcENlbGwgfHwgdGhpcy5ib2FyZFtwb3NBXVtwb3NCXS5yZXNlcnZlZClcclxuICAgICAgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMuZ2V0RGlyZWN0aW9uKCk7XHJcbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcC5nZXRMZW5ndGgoKTtcclxuXHJcbiAgICBpZiAoZGlyZWN0aW9uID09PSBIT1JJWk9OVEFMKSB7XHJcbiAgICAgIC8vIGNoZWNrIGlmIHdlIGNhbiBzaGlwIGxlbmdodCBjYW4gYmUgcHV0IGluIGN1cnJlbnQgY2VsbDtcclxuICAgICAgaWYgKHNoaXBMZW5ndGggKyBwb3NCID4gR2FtZWJvYXJkLm1heFNpemUpIHJldHVybjtcclxuICAgICAgLy9jaGVjayBpZiBvdGhlciBjZWxscyBmb3Igc2hpcCBpcyBlbXB0eSBvciByZXNlcnZlZFxyXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHsgc2hpcENlbGwsIHJlc2VydmVkIH0gPSB0aGlzLmJvYXJkW3Bvc0FdW3Bvc0IgKyBpXTtcclxuICAgICAgICBpZiAoc2hpcENlbGwgfHwgcmVzZXJ2ZWQpIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICAvLyBmaWxsIGJvYXJkIHBvc2l0aW9uIHdpdGggc2hpcCBlbGVtZW50c1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRoaXMuYm9hcmRbcG9zQV1bcG9zQiArIGldLnNoaXBDZWxsID0gc2hpcDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gZmlsbCBib2FyZCB3aXRoIHJlc2VydmVkIGNlbGxzIGFyb3VuZCBzaGlwIGVsZW1lbnRzXHJcbiAgICAgIGZvciAobGV0IGkgPSAtMTsgaSA8PSAxOyBpKyspIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmJvYXJkW3Bvc0EgKyBpXSk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmJvYXJkW3Bvc0EgKyBpXSkgY29udGludWU7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IC0xOyBqIDw9IHNoaXBMZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5ib2FyZFtwb3NBICsgaV0pO1xyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBwb3NCICsgaiA8IDAgfHxcclxuICAgICAgICAgICAgcG9zQiArIGogPj0gR2FtZWJvYXJkLm1heFNpemUgfHxcclxuICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NBICsgaV1bcG9zQiArIGpdLnNoaXBDZWxsXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgIHRoaXMuYm9hcmRbcG9zQSArIGldW3Bvc0IgKyBqXS5yZXNlcnZlZCA9IHRydWU7XHJcbiAgICAgICAgICBzaGlwLmFkZFJlc2VydmVkUG9zaXRpb25zKHsgcG9zQTogcG9zQSArIGksIHBvc0I6IHBvc0IgKyBqIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFZFUlRJQ0FMKSB7XHJcbiAgICAgIGlmIChzaGlwTGVuZ3RoICsgcG9zQSA+IEdhbWVib2FyZC5tYXhTaXplKSByZXR1cm47XHJcblxyXG4gICAgICAvLyBjaGVjayBpZiBjZWxsIGlzIGVtcHR5IG9yIHJlc2VydmVkIGZvciBzaGlwIGxlbmd0aFxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHsgc2hpcENlbGwsIHJlc2VydmVkIH0gPSB0aGlzLmJvYXJkW3Bvc0EgKyBpXVtwb3NCXTtcclxuXHJcbiAgICAgICAgaWYgKHNoaXBDZWxsIHx8IHJlc2VydmVkKSByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgLy8gZmlsbCBib2FyZCBwb3NpdGlvbiB3aXRoIHNoaXAgZWxlbWVudHNcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLmJvYXJkW3Bvc0EgKyBpXVtwb3NCXS5zaGlwQ2VsbCA9IHNoaXA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGZpbGwgYm9hcmQgd2l0aCByZXNlcnZlZCBjZWxscyBhcm91bmQgc2hpcCBlbGVtZW50c1xyXG4gICAgICBmb3IgKGxldCBpID0gLTE7IGkgPD0gc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmJvYXJkW3Bvc0EgKyBpXSkgY29udGludWU7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGogPSAtMTsgaiA8PSAxOyBqKyspIHtcclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgcG9zQiArIGogPCAwIHx8XHJcbiAgICAgICAgICAgIHBvc0IgKyBqID49IEdhbWVib2FyZC5tYXhTaXplIHx8XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbcG9zQSArIGldW3Bvc0IgKyBqXS5zaGlwQ2VsbFxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIHRoaXMuYm9hcmRbcG9zQSArIGldW3Bvc0IgKyBqXS5yZXNlcnZlZCA9IHRydWU7XHJcbiAgICAgICAgICBzaGlwLmFkZFJlc2VydmVkUG9zaXRpb25zKHsgcG9zQTogcG9zQSArIGksIHBvc0I6IHBvc0IgKyBqIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzaGlwO1xyXG4gIH1cclxuXHJcbiAgYWRkUmFuZG9tU2hpcHMoc2hpcHMpIHtcclxuICAgIHRoaXMuY3JlYXRlR2FtZWJvYXJkKCk7XHJcblxyXG4gICAgd2hpbGUgKHNoaXBzLmxlbmd0aCA+IDApIHtcclxuICAgICAgbGV0IHBvc0EgPSBnZXRSYW5kb21OdW1iZXIoR2FtZWJvYXJkLm1heFNpemUpO1xyXG4gICAgICBsZXQgcG9zQiA9IGdldFJhbmRvbU51bWJlcihHYW1lYm9hcmQubWF4U2l6ZSk7XHJcblxyXG4gICAgICBsZXQgZGlyZWN0aW9uID0gZ2V0UmFuZG9tTnVtYmVyKHRoaXMuZGlyZWN0aW9ucy5sZW5ndGgpO1xyXG4gICAgICAvLyBsZXQgZGlyZWN0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5kaXJlY3Rpb25zLmxlbmd0aCk7XHJcblxyXG4gICAgICAvLy8gPz8/Pz8/XHJcbiAgICAgIC8vLy8gTklFIFdJRU0gQ1pZIERaSUHFgUFcclxuICAgICAgLy8vLy8vXHJcbiAgICAgIGlmIChkaXJlY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmNoYW5nZURpcmVjdGlvbigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBbZmlyc3QsIC4uLm90aGVyc10gPSBzaGlwcztcclxuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hZGRTaGlwKHBvc0EsIHBvc0IsIGZpcnN0KTtcclxuICAgICAgaWYgKHJlc3VsdCkgc2hpcHMgPSBvdGhlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYm9hcmQ7XHJcbiAgfVxyXG5cclxuICByZWNlaXZlQXR0YWNrKHBvc0EsIHBvc0IpIHtcclxuICAgIGNvbnN0IHsgbWFya2VkLCBzaGlwQ2VsbCB9ID0gdGhpcy5ib2FyZFtwb3NBXVtwb3NCXTtcclxuXHJcbiAgICAvL2NoZWNrIGlmIGVsZW1lbnQgaXMgbWFya2VkXHJcbiAgICBpZiAobWFya2VkKSByZXR1cm47XHJcblxyXG4gICAgLy8gc2V0IG1hcmtlZCBwcm9wZXJ0eSB0byB0cnVlO1xyXG4gICAgdGhpcy5ib2FyZFtwb3NBXVtwb3NCXS5tYXJrZWQgPSB0cnVlO1xyXG5cclxuICAgIGlmIChzaGlwQ2VsbCkgc2hpcENlbGwucmVjZWl2ZUhpdCgpO1xyXG5cclxuICAgIC8vIHJldHVybiBvYmplY3QgZnJvbSBib2FyZFxyXG4gICAgcmV0dXJuIHRoaXMuYm9hcmRbcG9zQV1bcG9zQl07XHJcbiAgfVxyXG5cclxuICBhZGRSZXNlcnZlZFNoaXBQb3NpdGlvbnMocmVzZXJ2ZWRQb3NpdGlvbnMpIHtcclxuICAgIHJlc2VydmVkUG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgcG9zQSwgcG9zQiB9ID0gcG9zaXRpb247XHJcbiAgICAgIGlmICghdGhpcy5ib2FyZFtwb3NBXVtwb3NCXS5tYXJrZWQpIHRoaXMuYm9hcmRbcG9zQV1bcG9zQl0ubWFya2VkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xyXG4iLCJpbXBvcnQgeyBUSU1FX0RFTEFZLCBUSU1FX09VVCB9IGZyb20gXCIuLi8uLi91dGlscy9jb25zdGFudHNcIjtcclxuaW1wb3J0IHsgc2xlZXAgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGVscGVyc1wiO1xyXG5pbXBvcnQgQ29tcHV0ZXIgZnJvbSBcIi4vcGxheWVycy9jb21wdXRlclwiO1xyXG5pbXBvcnQgVXNlciBmcm9tIFwiLi9wbGF5ZXJzL3VzZXJcIjtcclxuaW1wb3J0IHsgUXVldWUgfSBmcm9tIFwiLi9xdWV1ZS9xdWV1ZVwiO1xyXG5cclxuY2xhc3MgR2FtZSB7XHJcbiAgc2hpcFF1ZXVlID0gbmV3IFF1ZXVlKCk7XHJcbiAgY3VycmVudFBsYXllciA9IG5ldyBVc2VyKCk7XHJcbiAgZW5lbXlQbGF5ZXIgPSBuZXcgQ29tcHV0ZXIoKTtcclxuICB0aW1lcjtcclxuICBkZWxheTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmFkZFF1ZXVlU2hpcHMoKTtcclxuICB9XHJcblxyXG4gIHNldFVzZXJQbGF5ZXJOYW1lKG5hbWUpIHtcclxuICAgIHRoaXMuY3VycmVudFBsYXllci5zZXROYW1lKG5hbWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3VycmVudFBsYXllckdhbWVib2FyZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRQbGF5ZXIuZ2V0UGxheWVyQm9hcmQoKTtcclxuICB9XHJcblxyXG4gIGdldEN1cnJlbnRQbGF5ZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50UGxheWVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0RW5lbXlQbGF5ZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbmVteVBsYXllcjtcclxuICB9XHJcblxyXG4gIGdldEN1cnJlbnROYW1lKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFBsYXllci5nZXROYW1lKCk7XHJcbiAgfVxyXG5cclxuICBnZXRQbGF5ZXJzKCkge1xyXG4gICAgcmV0dXJuIFt0aGlzLmN1cnJlbnRQbGF5ZXIsIHRoaXMuZW5lbXlQbGF5ZXJdO1xyXG4gIH1cclxuXHJcbiAgZ2V0R2FtZWJvYXJkRGlyZWN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFBsYXllci5nZXRDdXJyZW50Qm9hcmREaXJlY3Rpb24oKTtcclxuICB9XHJcblxyXG4gIHVzZXJQbGF5aW5nKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFBsYXllciBpbnN0YW5jZW9mIFVzZXI7XHJcbiAgfVxyXG5cclxuICBzd2l0Y2hQbGF5ZXJzKCkge1xyXG4gICAgY29uc3QgdGVtcCA9IHRoaXMuY3VycmVudFBsYXllcjtcclxuICAgIHRoaXMuY3VycmVudFBsYXllciA9IHRoaXMuZW5lbXlQbGF5ZXI7XHJcbiAgICB0aGlzLmVuZW15UGxheWVyID0gdGVtcDtcclxuICB9XHJcblxyXG4gIHJlc3RhcnRHYW1lKCkge1xyXG4gICAgaWYgKCF0aGlzLnVzZXJQbGF5aW5nKCkpIHtcclxuICAgICAgdGhpcy5zd2l0Y2hQbGF5ZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgcGxheWVyIG9mIHRoaXMuZ2V0UGxheWVycygpKSB7XHJcbiAgICAgIHBsYXllci5jbGVhclBsYXllckJvYXJkKCk7XHJcbiAgICAgIHBsYXllci5yZXNldFNoaXBzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hZGRRdWV1ZVNoaXBzKCk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VHYW1lYm9hcmREaXJlY3Rpb24oKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRQbGF5ZXIuY2hhbmdlQ3VycmVudEJvYXJkRGlyZWN0aW9uKCk7XHJcbiAgfVxyXG5cclxuICBnZXRTaGlwUGljaygpIHtcclxuICAgIGNvbnN0IHNoaXAgPSB0aGlzLnNoaXBRdWV1ZS5wZWVrKCk7XHJcbiAgICBjb25zdCBjdXJyZW50U2hpcExlZnQgPSB0aGlzLmdldEN1cnJlbnRTaGlwTGVmdCgpO1xyXG4gICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5nZXRHYW1lYm9hcmREaXJlY3Rpb24oKTtcclxuXHJcbiAgICByZXR1cm4geyBzaGlwLCBjdXJyZW50U2hpcExlZnQsIGRpcmVjdGlvbiB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0UXVldWVTaGlwKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2hpcFF1ZXVlLnBlZWsoKTtcclxuICB9XHJcblxyXG4gIGRlcXVlU2hpcCgpIHtcclxuICAgIHRoaXMuc2hpcFF1ZXVlLmRlcXVldWUoKTtcclxuICB9XHJcblxyXG4gIGVtcHR5UXVldWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zaGlwUXVldWUuaXNFbXB0eSgpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJRdWV1ZVNoaXAoKSB7XHJcbiAgICB0aGlzLnNoaXBRdWV1ZS5jbGVhclF1ZXVlKCk7XHJcbiAgfVxyXG5cclxuICBhZGRRdWV1ZVNoaXBzKCkge1xyXG4gICAgY29uc3Qgc2hpcHMgPSB0aGlzLmN1cnJlbnRQbGF5ZXIuZ2V0U2hpcHMoKTtcclxuICAgIHRoaXMuc2hpcFF1ZXVlLmFkZEVsZW1lbnRzKHNoaXBzKTtcclxuICB9XHJcblxyXG4gIHNhbWVMZW5ndGhTaGlwcyhjdXJyZW50KSB7XHJcbiAgICBjb25zdCBwZWVrTGVuZ3RoID0gdGhpcy5nZXRRdWV1ZVNoaXAoKS5nZXRMZW5ndGgoKTtcclxuXHJcbiAgICBjb25zdCBjb25kaXRpb24gPSBwZWVrTGVuZ3RoICE9PSBjdXJyZW50LmdldExlbmd0aCgpO1xyXG5cclxuICAgIHJldHVybiBjb25kaXRpb247XHJcbiAgfVxyXG5cclxuICBnZXRDdXJyZW50U2hpcExlZnQoKSB7XHJcbiAgICBpZiAoIXRoaXMudXNlclBsYXlpbmcoKSkgcmV0dXJuO1xyXG4gICAgY29uc3QgY2IgPSB0aGlzLnNhbWVMZW5ndGhTaGlwcy5iaW5kKHRoaXMpO1xyXG4gICAgcmV0dXJuIHRoaXMuc2hpcFF1ZXVlLmNvdW50RWxlbWVudChjYik7XHJcbiAgfVxyXG5cclxuICBhc3luYyBzZXRUaW1lcihjYikge1xyXG4gICAgdGhpcy50aW1lciA9IHRydWU7XHJcblxyXG4gICAgYXdhaXQgc2xlZXAoVElNRV9PVVQpO1xyXG4gICAgdGhpcy50aW1lciA9IGZhbHNlO1xyXG4gICAgY2IoKTtcclxuICAgIHRoaXMuZGVsYXkgPSB0cnVlO1xyXG4gICAgYXdhaXQgc2xlZXAoVElNRV9ERUxBWSk7XHJcbiAgICB0aGlzLmRlbGF5ID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvLyBzZXRUaW1lcihjYikge1xyXG4gIC8vICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gIC8vICAgICB0aGlzLnRpbWVyID0gbnVsbDtcclxuICAvLyAgICAgY29uc29sZS5sb2coXCJ0aW1lciBpcyBvdmVyXCIpO1xyXG4gIC8vICAgICBjYigpO1xyXG4gIC8vICAgICB0aGlzLmRlbGF5ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgLy8gICAgICAgdGhpcy5kZWxheSA9IG51bGw7XHJcbiAgLy8gICAgICAgY29uc29sZS5sb2coXCJkZWxheSBpcyBvdmVyXCIpO1xyXG4gIC8vICAgICB9LCAzNTApO1xyXG4gIC8vICAgfSwgVElNRV9PVVQpO1xyXG4gIC8vIH1cclxuXHJcbiAgZ2V0VGltZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50aW1lcjtcclxuICB9XHJcblxyXG4gIGdldERlbGF5KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGVsYXk7XHJcbiAgfVxyXG5cclxuICBzdG9wUGxheWluZygpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIHRoaXMuZW5lbXlQbGF5ZXIuYWxsU3Vua2VuU2hpcHMoKSB8fCB0aGlzLmN1cnJlbnRQbGF5ZXIuYWxsU3Vua2VuU2hpcHMoKVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEdhbWU7XHJcbiIsImltcG9ydCB7IGJpbmFyeVNlYXJjaCwgZ2V0UmFuZG9tTnVtYmVyIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2hlbHBlcnNcIjtcclxuaW1wb3J0IFNoaXBQb3NpdGlvbiBmcm9tIFwiLi4vc2hpcFBvc2l0aW9uL3NoaXBQb3NpdGlvblwiO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllclwiO1xyXG5cclxuY2xhc3MgQ29tcHV0ZXIgZXh0ZW5kcyBQbGF5ZXIge1xyXG4gIGF2YWlsYWJsZVBvc2l0aW9ucyA9IFtdO1xyXG4gIHNoaXBIaXQ7XHJcblxyXG4gIHBvc2l0aW9uO1xyXG4gIHBvdGVudGlhbFNoaXBQb3NpdGlvbnMgPSBuZXcgU2hpcFBvc2l0aW9uKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMuc2hpcEhpdCA9IGZhbHNlO1xyXG4gICAgdGhpcy5uYW1lID0gXCJjb21wdXRlclwiO1xyXG4gIH1cclxuXHJcbiAgZ2V0VHlwZSgpIHtcclxuICAgIHJldHVybiB0aGlzLm5hbWU7XHJcbiAgfVxyXG5cclxuICBnZXROYW1lKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubmFtZTtcclxuICB9XHJcblxyXG4gIHNlbGVjdFNoaXBIaXR0aW5nKCkge1xyXG4gICAgdGhpcy5zaGlwSGl0ID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGRlc2VsZWN0U2hpcEhpdHRpbmcoKSB7XHJcbiAgICB0aGlzLnNoaXBIaXQgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8vIG1ldGhvZCBhZGQgYWxsIHBvc3NpYmxlIGJvYXJkIHBvc2l0aW9uc1xyXG4gIC8vIHRvIGF2YWlsYWJsZVBvc2l0aW9ucyBhcnJheVxyXG4gIGFkZEdhbWVib2FyZFBvc2l0aW9ucyhib2FyZCkge1xyXG4gICAgLy8gc2V0IHVzZXIgYm9hcmQgZm9yIGNvbXB1dGVyIHRvIGtub3cgd2hhdCBtb3ZlcyBpdCBjYW4gZG9cclxuICAgIC8vIGFyb3VuZCBoaXQgc2hpcCBjZWxsXHJcbiAgICB0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMuc2V0Qm9hcmQoYm9hcmQpO1xyXG5cclxuICAgIGlmICh0aGlzLmF2YWlsYWJsZVBvc2l0aW9ucy5sZW5ndGggIT09IDApXHJcbiAgICAgIHRoaXMuYXZhaWxhYmxlUG9zaXRpb25zLmxlbmd0aCA9IDA7XHJcbiAgICAvLyBjb25zdCBib2FyZCA9IHRoaXMuZ2V0UGxheWVyQm9hcmQoKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmRbaV0ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICB0aGlzLmF2YWlsYWJsZVBvc2l0aW9ucy5wdXNoKHsgcG9zQTogaSwgcG9zQjogaiB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gbWV0aG9kIHJldHVybnMgcG90ZW50aWFsIGJvYXJkIHNoaXAgcG9zaXRpb24gZm9yIGNvbXB1dGVyXHJcbiAgZ2V0RW5lbXlQb3NpdGlvbkJvYXJkKCkge1xyXG4gICAgLy8gaWYgIHNoaXAgd2FzIGhpdCwgZ2V0IG9ubHkgcG9zaXRpb25zXHJcbiAgICAvLyBhcm91bmQgdGhhdCBzaGlwIGhpdCBwb3NpdGlvblxyXG4gICAgaWYgKHRoaXMuc2hpcEhpdCkge1xyXG4gICAgICBjb25zdCBuZXh0UG9zaXRpb24gPSB0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMuZ2V0QWRqYWNlbnRIaXRQb3NpdGlvbnMoXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvblxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLnBvc2l0aW9uID0gbmV4dFBvc2l0aW9uOyAvLyBhc3NpZ24gdGhpcyAgcG9zaXRpb24gdG8gcHJvcGVydHlcclxuXHJcbiAgICAgIC8vIHNlYXJjaCBjb3JyZWN0IGluZGV4IG9mIGF2YWlsYWJsZVBvc2l0aW9ucyBhcnJheVxyXG4gICAgICBjb25zdCBpbmRleCA9IGJpbmFyeVNlYXJjaCh0aGlzLmF2YWlsYWJsZVBvc2l0aW9ucywgdGhpcy5wb3NpdGlvbik7XHJcbiAgICAgIC8vIG5leHQgcmVtb3ZlIHRoZSBwb3NpdGlvbiBmcm9tIGF2YWlsYWJlUG9zaXRpb24gYXJyYXlcclxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkgdGhpcy5hdmFpbGFibGVQb3NpdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMuYXZhaWxhYmxlUG9zaXRpb25zLnBvcCgpO1xyXG5cclxuICAgICAgICB0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMuY2xlYXJQb3RlbnRpYWxQb3NpdGlvbigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBvdGhlcndpc2UgcmFuZG9tbHkgZ2V0IHBvdGVudGlhbCBib2FyZCBzaGlwXHJcbiAgICAgIC8vIHBvc2l0aW9uIGZyb20gYXZhaWxhYmxlUG9zaXRpb24gYXJyYXlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHJhbmRvbU51bWJlciA9IGdldFJhbmRvbU51bWJlcih0aGlzLmF2YWlsYWJsZVBvc2l0aW9ucy5sZW5ndGgpO1xyXG4gICAgICAvLyBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKFxyXG4gICAgICAvLyAgIE1hdGgucmFuZG9tKCkgKiB0aGlzLmF2YWlsYWJsZVBvc2l0aW9ucy5sZW5ndGhcclxuICAgICAgLy8gKTtcclxuXHJcbiAgICAgIC8vIGFzc2lnbiB0byBlbGVtZW50IG9mIHJhbmRvbW51bWJlciBpbmRleFxyXG4gICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5hdmFpbGFibGVQb3NpdGlvbnNbcmFuZG9tTnVtYmVyXTtcclxuXHJcbiAgICAgIC8vIG5leHQgcmVtb3ZlIHRoZSBwb3NpdGlvbiBmcm9tIGF2YWlsYWJlUG9zaXRpb24gYXJyYXlcclxuICAgICAgdGhpcy5hdmFpbGFibGVQb3NpdGlvbnMuc3BsaWNlKHJhbmRvbU51bWJlciwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb247XHJcbiAgfVxyXG5cclxuICBjbGVhclBvdGVudGlhbFNoaXBQb3NpdGlvbnMoKSB7XHJcbiAgICB0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMuY2xlYXJQb3RlbnRpYWxQb3NpdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJSZXNlcnZlZFBvc2l0aW9ucyhyZXNlcnZlZFBvc2l0aW9ucykge1xyXG4gICAgcmVzZXJ2ZWRQb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcclxuICAgICAgY29uc3QgaW5kZXggPSBiaW5hcnlTZWFyY2godGhpcy5hdmFpbGFibGVQb3NpdGlvbnMsIHBvc2l0aW9uKTtcclxuICAgICAgaWYgKGluZGV4ID49IDApIHRoaXMuYXZhaWxhYmxlUG9zaXRpb25zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbXB1dGVyO1xyXG4iLCJpbXBvcnQgeyBTSElQX1NJWkVTIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgR2FtZWJvYXJkIGZyb20gXCIuLi9nYW1lYm9hcmQvZ2FtZWJvYXJkXCI7XHJcbmltcG9ydCBTaGlwIGZyb20gXCIuLi9zaGlwL3NoaXBcIjtcclxuXHJcbmNsYXNzIFBsYXllciB7XHJcbiAgZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xyXG4gIHNoaXBzID0gW107XHJcbiAgc3Vua2VuU2hpcHMgPSAwO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuYWRkU2hpcHMoKTtcclxuICB9XHJcblxyXG4gIGdldFNoaXBzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2hpcHM7XHJcbiAgfVxyXG5cclxuICBnZXRQbGF5ZXJCb2FyZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmdhbWVib2FyZC5nZXRHYW1lYm9hcmQoKTtcclxuICB9XHJcblxyXG4gIGdldEN1cnJlbnRCb2FyZERpcmVjdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmdhbWVib2FyZC5nZXREaXJlY3Rpb24oKTtcclxuICB9XHJcblxyXG4gIGNoYW5nZUN1cnJlbnRCb2FyZERpcmVjdGlvbigpIHtcclxuICAgIHRoaXMuZ2FtZWJvYXJkLmNoYW5nZURpcmVjdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJQbGF5ZXJCb2FyZCgpIHtcclxuICAgIHRoaXMuZ2FtZWJvYXJkLmNyZWF0ZUdhbWVib2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgcmVzZXRTaGlwcygpIHtcclxuICAgIHRoaXMuc3Vua2VuU2hpcHMgPSAwO1xyXG4gICAgdGhpcy5hZGRTaGlwcygpO1xyXG4gIH1cclxuXHJcbiAgYWRkU2hpcHMoKSB7XHJcbiAgICBpZiAodGhpcy5zaGlwcy5sZW5ndGggIT09IDApIHRoaXMuc2hpcHMubGVuZ3RoID0gMDtcclxuICAgIFNISVBfU0laRVMuZm9yRWFjaCgoc2l6ZSkgPT4ge1xyXG4gICAgICBsZXQgc2hpcCA9IG5ldyBTaGlwKHNpemUpO1xyXG4gICAgICB0aGlzLnNoaXBzLnB1c2goc2hpcCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZFJhbmRvbVNoaXBzUG9zaXRpb24oKSB7XHJcbiAgICB0aGlzLmdhbWVib2FyZC5hZGRSYW5kb21TaGlwcyh0aGlzLnNoaXBzKTtcclxuICB9XHJcblxyXG4gIGFkZFNoaXBPblBsYXllckdhbWVib2FyZChwb3NBLCBwb3NCLCBzaGlwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nYW1lYm9hcmQuYWRkU2hpcCgrcG9zQSwgK3Bvc0IsIHNoaXApO1xyXG4gIH1cclxuXHJcbiAgcmVjZWl2ZUF0dGFjayhwb3NBLCBwb3NCKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhwb3NBLCBwb3NCKTtcclxuICB9XHJcblxyXG4gIGF0dGFja0VuZW15R2FtZWJvYXJkKHBvc2l0aW9uLCBlbmVteSkge1xyXG4gICAgY29uc3QgeyBwb3NBLCBwb3NCIH0gPSBwb3NpdGlvbjtcclxuICAgIHJldHVybiBlbmVteS5yZWNlaXZlQXR0YWNrKCtwb3NBLCArcG9zQik7XHJcbiAgfVxyXG5cclxuICBhZGRSZXNlcnZlZFNoaXBQb3NpdGlvbnMocmVzZXJ2ZWRQb3NpdGlvbnMpIHtcclxuICAgIHRoaXMuZ2FtZWJvYXJkLmFkZFJlc2VydmVkU2hpcFBvc2l0aW9ucyhyZXNlcnZlZFBvc2l0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBpbmNyZWFzZVN1bmtlblNoaXBzKCkge1xyXG4gICAgdGhpcy5zdW5rZW5TaGlwcysrO1xyXG4gIH1cclxuXHJcbiAgYWxsU3Vua2VuU2hpcHMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdW5rZW5TaGlwcyA9PT0gdGhpcy5zaGlwcy5sZW5ndGg7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XHJcbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyXCI7XHJcblxyXG5jbGFzcyBVc2VyIGV4dGVuZHMgUGxheWVyIHtcclxuICBuYW1lO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBnZXRUeXBlKCkge1xyXG4gICAgcmV0dXJuIFwidXNlclwiO1xyXG4gIH1cclxuXHJcbiAgZ2V0TmFtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLm5hbWUgfHwgXCJVbmtub3duXCI7XHJcbiAgfVxyXG5cclxuICBzZXROYW1lKG5hbWUpIHtcclxuICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBVc2VyO1xyXG4iLCJleHBvcnQgY2xhc3MgUXVldWUge1xyXG4gIGVsZW1lbnRzID0ge307XHJcbiAgaGVhZCA9IDA7XHJcbiAgdGFpbCA9IDA7XHJcblxyXG4gIGNsZWFyUXVldWUoKSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge307XHJcbiAgICB0aGlzLmhlYWQgPSAwO1xyXG4gICAgdGhpcy50YWlsID0gMDtcclxuICB9XHJcblxyXG4gIGVucXVldWUoZWxlbWVudCkge1xyXG4gICAgdGhpcy5lbGVtZW50c1t0aGlzLnRhaWxdID0gZWxlbWVudDtcclxuICAgIHRoaXMudGFpbCsrO1xyXG4gIH1cclxuXHJcbiAgZGVxdWV1ZSgpIHtcclxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmVsZW1lbnRzW3RoaXMuaGVhZF07XHJcbiAgICBkZWxldGUgdGhpcy5lbGVtZW50c1t0aGlzLmhlYWRdO1xyXG4gICAgdGhpcy5oZWFkKys7XHJcbiAgICByZXR1cm4gaXRlbTtcclxuICB9XHJcblxyXG4gIHBlZWsoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50c1t0aGlzLmhlYWRdO1xyXG4gIH1cclxuXHJcbiAgY291bnRFbGVtZW50KGNiKSB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgZm9yIChjb25zdCBlbCBpbiB0aGlzLmVsZW1lbnRzKSB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmVsZW1lbnRzW2VsXTtcclxuICAgICAgY29uc3QgY29uZGl0aW9uID0gY2IoY3VycmVudCk7XHJcbiAgICAgIGlmIChjb25kaXRpb24pIGJyZWFrO1xyXG4gICAgICBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvdW50O1xyXG4gIH1cclxuXHJcbiAgZ2V0TGVuZ3RoKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudGFpbCAtIHRoaXMuaGVhZDtcclxuICB9XHJcblxyXG4gIGlzRW1wdHkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRMZW5ndGgoKSA9PT0gMDtcclxuICB9XHJcblxyXG4gIGFkZEVsZW1lbnRzKGVsZW1lbnRzKSB7XHJcbiAgICB0aGlzLmNsZWFyUXVldWUoKTtcclxuICAgIGZvciAobGV0IGVsIG9mIGVsZW1lbnRzKSB0aGlzLmVucXVldWUoZWwpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBnZXRSYW5kb21OdW1iZXIgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvaGVscGVyc1wiO1xyXG5cclxuY2xhc3MgU2hpcFBvc2l0aW9uIHtcclxuICBib2FyZCA9IFtdO1xyXG4gIC8vIHByb3BlcnRpZXMgdG8gY2hvb3NlIHBvdGVudGlhbCBwb3NpdG9uc1xyXG4gIC8vIHdoZW4gc2hpcCBpcyBoaXRcclxuICBwb3RlbnRpYWxTaGlwUG9zaXRpb25zID0gW107XHJcbiAgbmV4dFBvc2l0aW9uO1xyXG4gIHBvdGVudGlhbERpcmVjdGlvbnMgPSBbXHJcbiAgICBbLTEsIDBdLCAvLyB1cCBuZXh0IHBvc2l0aW9uXHJcbiAgICBbMCwgMV0sIC8vIHJpZ2h0IG5leHQgcG9zaXRpb25cclxuICAgIFsxLCAwXSwgLy8gYm90dG9tIG5leHQgcG9zaXRpb25cclxuICAgIFswLCAtMV0sIC8vIGxlZnQgbmV4dCBwb3NpdGlvblxyXG4gIF07XHJcblxyXG4gIHNldEJvYXJkKGJvYXJkKSB7XHJcbiAgICB0aGlzLmJvYXJkID0gYm9hcmQ7XHJcbiAgfVxyXG5cclxuICBpc0V2ZW4oZGlyZWN0aW9uKSB7XHJcbiAgICByZXR1cm4gZGlyZWN0aW9uICUgMiA9PT0gMDtcclxuICB9XHJcblxyXG4gIGlzT2RkKGRpcmVjdGlvbikge1xyXG4gICAgcmV0dXJuIGRpcmVjdGlvbiAlIDIgPT09IDE7XHJcbiAgfVxyXG5cclxuICAvLyBhZGQgZXZlcnkgcG9zc2libGUgZGlyZWN0aW9uIHRvIGNoZWNrIGNvbXB1dGVyIGFycmF5IHBvc2l0aW9uc1xyXG4gIGNyZWF0ZVBvdGVudGlhbFBvc2l0aW9uKHBvc0EsIHBvc0IpIHtcclxuICAgIC8vIGxvb3AgdG8gY2hlY2sgZXZlcnkgcG90ZW50aWFsIGRpcmVjdGlvbiBhdmFpbGFibGUgb24gYm9hcmRcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wb3RlbnRpYWxEaXJlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IFt4LCB5XSA9IHRoaXMucG90ZW50aWFsRGlyZWN0aW9uc1tpXTtcclxuICAgICAgY29uc3QgcG9zWCA9IHBvc0EgKyB4O1xyXG4gICAgICBjb25zdCBwb3NZID0gcG9zQiArIHk7XHJcbiAgICAgIC8vIGNoZWNrIGlmIHBvdGVudGlhbCBkaXJlY3Rpb24gZXhpc3Qgb24gYm9hcmRcclxuICAgICAgaWYgKHRoaXMuYm9hcmRbcG9zWF0/Lltwb3NZXSkge1xyXG4gICAgICAgIC8vIG5leHQgd2UgY2hlY2sgaWYgYm9hcmQgY2VsbCBpcyBtYXJrZWRcclxuICAgICAgICBpZiAoIXRoaXMuYm9hcmRbcG9zWF1bcG9zWV0ubWFya2VkKSB7XHJcbiAgICAgICAgICAvLyBkaXJlY3Rpb24gZGVmaW5lcyBhcyBpbmRleCdzIG51bWJlciBvZlxyXG4gICAgICAgICAgLy8gcG90ZW50aWFsIFBvc2l0aW9uc1xyXG4gICAgICAgICAgdGhpcy5wb3RlbnRpYWxTaGlwUG9zaXRpb25zLnB1c2goe1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogW3Bvc1gsIHBvc1ldLFxyXG4gICAgICAgICAgICBkaXJlY3Rpb246IGksXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldE5leHRQb3RlbnRpYWxTaGlwUG9zaXRpb24oKSB7XHJcbiAgICAvLyAxLiBGaXJzdCB3ZSBnZXQgcmFuZG9tIG51bWJlciBmb3IgaW5kZXggb2YgYXJyYXkgcG90ZW50aWFsQ29tcHV0ZXJQb3NpdGlvbnNcclxuXHJcbiAgICBjb25zdCByYW5kb21OdW1iZXIgPSBnZXRSYW5kb21OdW1iZXIodGhpcy5wb3RlbnRpYWxTaGlwUG9zaXRpb25zLmxlbmd0aCk7XHJcbiAgICAvLyBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLmZsb29yKFxyXG4gICAgLy8gICBNYXRoLnJhbmRvbSgpICogdGhpcy5wb3RlbnRpYWxTaGlwUG9zaXRpb25zLmxlbmd0aFxyXG4gICAgLy8gKTtcclxuXHJcbiAgICAvLyBldmVudHVhbGx5IGlmIGVsZW1lbnQgaXMgbm90IGluIGFycmF5IHdlIHJldHVybiBleGlzdCBuZXh0UG9zaXRpb25cclxuICAgIGlmICghdGhpcy5wb3RlbnRpYWxTaGlwUG9zaXRpb25zW3JhbmRvbU51bWJlcl0pIHtcclxuICAgICAgdGhpcy5jbGVhclBvdGVudGlhbFBvc2l0aW9uKCk7XHJcbiAgICAgIHJldHVybiB0aGlzLm5leHRQb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvLyAyLiBuZXh0IHdlIGdldCBwb3NpdGlvbiBhbmQgZGlyZWN0aW9uIGZyb20gZWxlbWVudCBvZlxyXG4gICAgLy8gcG90ZW50aWFsU2hpcFBvc2l0aW9ucyBhcnJheVxyXG4gICAgY29uc3QgeyBwb3NpdGlvbiwgZGlyZWN0aW9uIH0gPSB0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnNbcmFuZG9tTnVtYmVyXTtcclxuXHJcbiAgICAvLyAzLiBuZXh0IHdlIGFzc2lnbiB0d28gcG9zaXRpb25zIHRvIHZhcmlhYmxlc1xyXG4gICAgY29uc3QgeCA9IHBvc2l0aW9uWzBdO1xyXG4gICAgY29uc3QgeSA9IHBvc2l0aW9uWzFdO1xyXG5cclxuICAgIC8vIDQuIHdlIGFzc2lnbiBuZXh0UG9zaXRpb24gd2l0aCBwb3NpdGlvbiB4IGFuZCBwb3NpdGlvbiB5XHJcbiAgICAvLyBhbmQgd2UgZXh0cmFjdCBzaGlwIGNlbGwsIG1hcmtlZCwgcHJvcGVydHkgZnJvbSBib2FyZCBlbGVtZW50XHJcbiAgICB0aGlzLm5leHRQb3NpdGlvbiA9IHsgcG9zQTogeCwgcG9zQjogeSB9O1xyXG4gICAgY29uc3QgeyBzaGlwQ2VsbCwgbWFya2VkIH0gPSB0aGlzLmJvYXJkW3hdW3ldO1xyXG5cclxuICAgIC8vIDVhLiBjb25kaXRpb24gdG8gY2hlY2sgaWYgdGhlcmUgaXMgbm90IHNoaXAgY2VsbFxyXG4gICAgLy8gd2UgcmVtb3ZpbmcgZWxlbWVudCBmcm9tIHBvdGVudGlhbFNoaXBQb3NpdGlvbnNcclxuICAgIGlmICghc2hpcENlbGwpIHtcclxuICAgICAgdGhpcy5wb3RlbnRpYWxTaGlwUG9zaXRpb25zLnNwbGljZShyYW5kb21OdW1iZXIsIDEpO1xyXG4gICAgfVxyXG4gICAgLy8gNWIuIG90aGVyd2lzZSBpcyB0aGVyZSBzaGlwQ2VsbCBhbmQgbWFya2VkIGlzIGZhbHN5XHJcbiAgICAvLyB3ZSByZW1vdmUgYW5kXHJcbiAgICBlbHNlIGlmIChzaGlwQ2VsbCAmJiAhbWFya2VkKSB7XHJcbiAgICAgIC8vIDVjLiByZW1vdmUgZWxlbWVudCBmcm9tIHBvdGVudGlhbFNoaXBQb3NpdGlvbiBhcnJheVxyXG4gICAgICB0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMuc3BsaWNlKHJhbmRvbU51bWJlciwgMSk7XHJcblxyXG4gICAgICBjb25zdCBjb3JyZWN0RGlyZWN0aW9uID0gZGlyZWN0aW9uICUgMiA9PT0gMDtcclxuXHJcbiAgICAgIC8vIGZpbHRlciBlbGVtZW50cyBvbmx5IHdpdGggY29ycmVjdCBkaXJlY3Rpb25cclxuICAgICAgLy8gZGVwZW5kaW5nIG9uIHBvc2l0aW9uIHNoaXAgb24gYm9hcmRcclxuICAgICAgY29uc3QgZmlsdGVyUG9zaXRpb25zID0gdGhpcy5wb3RlbnRpYWxTaGlwUG9zaXRpb25zLmZpbHRlcigocG9zaXRpb24pID0+IHtcclxuICAgICAgICBjb25zdCB7IGRpcmVjdGlvbiB9ID0gcG9zaXRpb247XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29ycmVjdERpcmVjdGlvblxyXG4gICAgICAgICAgPyB0aGlzLmlzRXZlbihkaXJlY3Rpb24pXHJcbiAgICAgICAgICA6IHRoaXMuaXNPZGQoZGlyZWN0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMgPSBmaWx0ZXJQb3NpdGlvbnM7XHJcblxyXG4gICAgICAvLyA1Yy4gd2Ugc2V0IHRvIGNoZWNrIG5leHQgcG9zaXRpb24gaW4gdGhlIHNhbWUgZGlyZWN0aW9uXHJcbiAgICAgIC8vIGxpa2Ugb3VyIGVsZW1lbnRcclxuICAgICAgY29uc3QgW2RpclgsIGRpclldID0gdGhpcy5wb3RlbnRpYWxEaXJlY3Rpb25zW2RpcmVjdGlvbl07XHJcblxyXG4gICAgICBjb25zdCBuZXh0WCA9IGRpclggKyB4O1xyXG4gICAgICBjb25zdCBuZXh0WSA9IGRpclkgKyB5O1xyXG5cclxuICAgICAgLy8gY2hlY2sgaWYgdGhlcmUgaXMgZWxlbWVudCBmb3IgbmV4dCBwb3NpdGlvblxyXG4gICAgICBpZiAodGhpcy5ib2FyZFtuZXh0WF0/LltuZXh0WV0pIHtcclxuICAgICAgICAvLyBjaGVjayBpZiBlbGVtZW50IG9uIGJvYXJkIGlzIG5vdCBtYXJrZWQgYW5kIGhhcyBzaGlwIG9iamVjdFxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICF0aGlzLmJvYXJkW25leHRYXVtuZXh0WV0ubWFya2VkICYmXHJcbiAgICAgICAgICB0aGlzLmJvYXJkW25leHRYXVtuZXh0WV0uc2hpcENlbGxcclxuICAgICAgICApIHtcclxuICAgICAgICAgIC8vIHdlIGFkZCBuZXh0IHBvc3NpYmxlIHBvc2l0aW9uIHRvXHJcbiAgICAgICAgICAvLyBwb3RlbnRpYWwgY29tcHV0ZXIgcG9zaXRpb24gYXJyYXlcclxuICAgICAgICAgIHRoaXMucG90ZW50aWFsU2hpcFBvc2l0aW9ucy5wdXNoKHtcclxuICAgICAgICAgICAgcG9zaXRpb246IFtuZXh0WCwgbmV4dFldLFxyXG4gICAgICAgICAgICBkaXJlY3Rpb24sXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIHJldHVybiBuZXh0UG9zaXRpb24gdG8gY2hlY2sgb24gdXNlciBib2FyZFxyXG5cclxuICAgIHJldHVybiB0aGlzLm5leHRQb3NpdGlvbjtcclxuICB9XHJcblxyXG4gIGdldEFkamFjZW50SGl0UG9zaXRpb25zKHBvc2l0aW9uKSB7XHJcbiAgICBpZiAodGhpcy5wb3RlbnRpYWxTaGlwUG9zaXRpb25zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBjb25zdCB7IHBvc0EsIHBvc0IgfSA9IHBvc2l0aW9uO1xyXG4gICAgICB0aGlzLmNyZWF0ZVBvdGVudGlhbFBvc2l0aW9uKHBvc0EsIHBvc0IpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmdldE5leHRQb3RlbnRpYWxTaGlwUG9zaXRpb24oKTtcclxuICB9XHJcblxyXG4gIC8vIGNsZWFyIHBvdGVudGlhbCBjb21wdXRlciBwb3NpdGlvbnMgbW92ZXMgZnJvbSBhcnJheVxyXG4gIGNsZWFyUG90ZW50aWFsUG9zaXRpb24oKSB7XHJcbiAgICB0aGlzLnBvdGVudGlhbFNoaXBQb3NpdGlvbnMubGVuZ3RoID0gMDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNoaXBQb3NpdGlvbjtcclxuIiwiaW1wb3J0IHsgY3VzdG9tQWxwaGFiZXQgfSBmcm9tIFwibmFub2lkXCI7XHJcbmltcG9ydCB7IENVU1RPTV9BTFBIQUJFVCwgU0laRV9JRCB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9jb25zdGFudHNcIjtcclxuXHJcbmNsYXNzIFNoaXAge1xyXG4gIGlkO1xyXG4gIGxlbmd0aDtcclxuICBoaXRzID0gMDtcclxuICByZXNlcnZlZFBvc2l0aW9ucyA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihsKSB7XHJcbiAgICB0aGlzLmxlbmd0aCA9IGw7XHJcbiAgICB0aGlzLmlkID0gdGhpcy5jcmVhdGVDdXN0b21JRCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0SUQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pZDtcclxuICB9XHJcblxyXG4gIGdldExlbmd0aCgpIHtcclxuICAgIHJldHVybiB0aGlzLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGdldEhpdHMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5oaXRzO1xyXG4gIH1cclxuXHJcbiAgZ2V0U3VuaygpIHtcclxuICAgIHJldHVybiB0aGlzLmhpdHMgPT09IHRoaXMubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVzZXJ2ZWRQb3NpdGlvbnMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZXNlcnZlZFBvc2l0aW9ucztcclxuICB9XHJcblxyXG4gIGNyZWF0ZUN1c3RvbUlEKCkge1xyXG4gICAgbGV0IG5hbm9pZCA9IGN1c3RvbUFscGhhYmV0KENVU1RPTV9BTFBIQUJFVCwgU0laRV9JRCk7XHJcbiAgICByZXR1cm4gbmFub2lkKCk7XHJcbiAgfVxyXG5cclxuICBjbGVhclJlc2VydmVkUG9zaXRpb25zKCkge1xyXG4gICAgdGhpcy5yZXNlcnZlZFBvc2l0aW9ucy5sZW5ndGggPSAwO1xyXG4gIH1cclxuXHJcbiAgYWRkUmVzZXJ2ZWRQb3NpdGlvbnMocG9zKSB7XHJcbiAgICB0aGlzLnJlc2VydmVkUG9zaXRpb25zLnB1c2gocG9zKTtcclxuICB9XHJcblxyXG4gIHJlY2VpdmVIaXQoKSB7XHJcbiAgICBpZiAodGhpcy5oaXRzIDwgdGhpcy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5oaXRzKys7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xyXG4iLCJpbXBvcnQgeyBIT1JJWk9OVEFMLCBWRVJUSUNBTCB9IGZyb20gXCIuLi8uLi91dGlscy9jb25zdGFudHNcIjtcclxuXHJcbmNsYXNzIEdhbWVwbGF5VmlldyB7XHJcbiAgZ2FtZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lXCIpO1xyXG4gIGdhbWVVc2VyRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXJcIik7XHJcbiAgZ2FtZUNvbXB1dGVyRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXB1dGVyXCIpO1xyXG5cclxuICBnYW1lYm9hcmRVc2VyRWwgPSB0aGlzLmdhbWVVc2VyRWwucXVlcnlTZWxlY3RvcihcIi5nYW1lLWJvYXJkXCIpO1xyXG4gIGdhbWVib2FyZENvbXB1dGVyRWwgPSB0aGlzLmdhbWVDb21wdXRlckVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1ib2FyZFwiKTtcclxuXHJcbiAgZ2FtZUNvbnRyb2xzRWwgPSB0aGlzLmdhbWVVc2VyRWwucXVlcnlTZWxlY3RvcihcIi5nYW1lLWNvbnRyb2xzXCIpO1xyXG4gIGdhbWVTaGlwRWwgPSB0aGlzLmdhbWVVc2VyRWwucXVlcnlTZWxlY3RvcihcIi5nYW1lLXNoaXBcIik7XHJcblxyXG4gIGdhbWVTaGlwT2JqZWN0RWwgPSB0aGlzLmdhbWVVc2VyRWwucXVlcnlTZWxlY3RvcihcIi5nYW1lLXNoaXAtb2JqZWN0XCIpO1xyXG4gIGdhbWVTaGlwQW1vdW50RWwgPSB0aGlzLmdhbWVVc2VyRWwucXVlcnlTZWxlY3RvcihcIi5nYW1lLXNoaXAtYW1vdW50XCIpO1xyXG5cclxuICBwbGF5R2FtZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheVwiKTtcclxuICByYW5kb21TaGlwQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYW5kb21cIik7XHJcbiAgcmVzZXRTaGlwQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXNldFwiKTtcclxuICByZXNldEN1cnJlbnRHYW1lO1xyXG5cclxuICBkcmFnZ2VkRWwgPSBudWxsO1xyXG5cclxuICBzaG93R2FtZXBsYXkoKSB7XHJcbiAgICB0aGlzLmdhbWVFbC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gICAgdGhpcy5nYW1lQ29udHJvbHNFbC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gICAgdGhpcy5zaG93U2hpcFBpY2soKTtcclxuICB9XHJcblxyXG4gIHJlbmRlckdhbWVwbGF5KHBsYXllcnMpIHtcclxuICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XHJcbiAgICAgIGNvbnN0IHR5cGUgPSBwbGF5ZXIuZ2V0VHlwZSgpO1xyXG4gICAgICBjb25zdCBuYW1lID0gcGxheWVyLmdldE5hbWUoKTtcclxuICAgICAgY29uc3QgYm9hcmQgPSBwbGF5ZXIuZ2V0UGxheWVyQm9hcmQoKTtcclxuICAgICAgY29uc3Qgc2hpcHMgPSBwbGF5ZXIuZ2V0U2hpcHMoKTtcclxuXHJcbiAgICAgIGNvbnN0IHBsYXllckVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodHlwZSk7XHJcbiAgICAgIGNvbnN0IHBsYXllck5hbWVFbCA9IHBsYXllckVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1wbGF5ZXJuYW1lXCIpO1xyXG4gICAgICBjb25zdCBnYW1lYm9hcmRFbCA9IHBsYXllckVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1ib2FyZFwiKTtcclxuICAgICAgY29uc3Qgc2hpcExpc3RFbCA9IHBsYXllckVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1saXN0LXNoaXBcIik7XHJcblxyXG4gICAgICB0aGlzLnJlbmRlclBsYXllcm5hbWUocGxheWVyTmFtZUVsLCBuYW1lKTtcclxuICAgICAgdGhpcy5yZW5kZXJHYW1lYm9hcmQoZ2FtZWJvYXJkRWwsIGJvYXJkKTtcclxuICAgICAgdGhpcy5yZW5kZXJTaGlwTGlzdChzaGlwTGlzdEVsLCBzaGlwcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnJlbmRlckluaXRpYWxHYW1lUGFuZWxzKCk7XHJcbiAgICAvLyB0aGlzLnRvZ2dsZUdhbWVQYW5lbCh0aGlzLmdhbWVDb21wdXRlckVsKTtcclxuICAgIHRoaXMuc2hvd0dhbWVwbGF5KCk7XHJcbiAgfVxyXG5cclxuICByZW5kZXJJbml0aWFsR2FtZVBhbmVscygpIHtcclxuICAgIHRoaXMuZ2FtZVVzZXJFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtcGFuZWxcIikuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xyXG4gICAgdGhpcy5nYW1lQ29tcHV0ZXJFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtcGFuZWxcIikuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyUGxheWVybmFtZShlbGVtZW50LCBuYW1lKSB7XHJcbiAgICBjb25zdCBwbGF5ZXJuYW1lID0gbmFtZSB8fCBcInVua25vd25cIjtcclxuICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBwbGF5ZXJuYW1lICsgXCIncyBib2FyZFwiO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyR2FtZWJvYXJkUmFuZG9tKGJvYXJkKSB7XHJcbiAgICBjb25zdCBnYW1lYm9hcmRFbCA9IHRoaXMuZ2FtZVVzZXJFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtYm9hcmRcIik7XHJcbiAgICB0aGlzLnJlbmRlckdhbWVib2FyZChnYW1lYm9hcmRFbCwgYm9hcmQpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyR2FtZWJvYXJkKGVsZW1lbnQsIGJvYXJkKSB7XHJcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgY29uc3Qgc2l6ZSA9IGJvYXJkLmxlbmd0aCAqIGJvYXJkLmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xyXG4gICAgICBsZXQgcG9zaXRpb24gPSAoXCIwXCIgKyBpKS5zbGljZSgtMik7XHJcbiAgICAgIGNvbnN0IFtwb3NBLCBwb3NCXSA9IHBvc2l0aW9uLnNwbGl0KFwiXCIpO1xyXG5cclxuICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG5cclxuICAgICAgY29uc3QgY2xzID0gYm9hcmRbK3Bvc0FdWytwb3NCXS5zaGlwQ2VsbFxyXG4gICAgICAgID8gXCJnYW1lLWNlbGwgZ2FtZS1jZWxsLXNoaXBcIlxyXG4gICAgICAgIDogXCJnYW1lLWNlbGxcIjtcclxuXHJcbiAgICAgIHNwYW4uY2xhc3NOYW1lID0gY2xzO1xyXG5cclxuICAgICAgc3Bhbi5kYXRhc2V0LnBvc0EgPSBwb3NBO1xyXG4gICAgICBzcGFuLmRhdGFzZXQucG9zQiA9IHBvc0I7XHJcblxyXG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHNwYW4pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyU2hpcExpc3QoZWwsIHNoaXBzKSB7XHJcbiAgICBlbC5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XHJcbiAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwc1tpXS5nZXRMZW5ndGgoKTtcclxuICAgICAgY29uc3Qgc2hpcElEID0gc2hpcHNbaV0uZ2V0SUQoKTtcclxuXHJcbiAgICAgIGxpLmRhdGFzZXQuc2hpcElkID0gc2hpcElEO1xyXG4gICAgICBsaS5jbGFzc05hbWUgPSBcImdhbWUtaXRlbS1zaGlwXCI7XHJcblxyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNoaXBMZW5ndGg7IGorKykge1xyXG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBzcGFuLmNsYXNzTmFtZSA9IFwiZ2FtZS1pdGVtLXBhcnRcIjtcclxuICAgICAgICBsaS5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgICAgfVxyXG4gICAgICBlbC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW5kZXJTaGlwUGljayhzaGlwUGljaykge1xyXG4gICAgY29uc3QgeyBzaGlwLCBjdXJyZW50U2hpcExlZnQsIGRpcmVjdGlvbiB9ID0gc2hpcFBpY2s7XHJcbiAgICB0aGlzLnNob3dTaGlwUGljaygpO1xyXG4gICAgdGhpcy5nYW1lU2hpcE9iamVjdEVsLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB0aGlzLmdhbWVTaGlwT2JqZWN0RWwuc2V0QXR0cmlidXRlKFwiZGF0YS1kaXJlY3Rpb25cIiwgZGlyZWN0aW9uKTtcclxuXHJcbiAgICBpZiAoIXNoaXApIHtcclxuICAgICAgdGhpcy5oaWRlU2hpcFBpY2soKTtcclxuICAgICAgdGhpcy5zaG93UGxheUJ1dHRvbigpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IHNoaXAuZ2V0TGVuZ3RoKCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBzcGFuLmNsYXNzTmFtZSA9IFwiZ2FtZS1zaGlwLXBhcnRcIjtcclxuXHJcbiAgICAgIHRoaXMuZ2FtZVNoaXBPYmplY3RFbC5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGlyZWN0aW9uID09PSBIT1JJWk9OVEFMKSB7XHJcbiAgICAgIHRoaXMuZ2FtZVNoaXBPYmplY3RFbC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke3RoaXMuZ2FtZVNoaXBPYmplY3RFbC5jaGlsZHJlbi5sZW5ndGh9LCAxZnIpYDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZ2FtZVNoaXBPYmplY3RFbC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgxLCAxZnIpYDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdhbWVTaGlwQW1vdW50RWwudGV4dENvbnRlbnQgPSBgeCR7Y3VycmVudFNoaXBMZWZ0fWA7XHJcbiAgfVxyXG5cclxuICByZW5kZXJHYW1lYm9hcmRTaGlwKGRhdGFCb2FyZCwgc2hpcCkge1xyXG4gICAgY29uc3QgeyBwb3NBLCBwb3NCLCBkaXJlY3Rpb24gfSA9IGRhdGFCb2FyZDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuZ2V0TGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICBjb25zdCBjZWxsUG9zQSA9IGRpcmVjdGlvbiA9PT0gVkVSVElDQUwgPyBpICogMSArICtwb3NBIDogK3Bvc0E7XHJcbiAgICAgIGNvbnN0IGNlbGxQb3NCID0gZGlyZWN0aW9uID09PSBWRVJUSUNBTCA/ICtwb3NCIDogK3Bvc0IgKyBpICogMTtcclxuICAgICAgY29uc3QgcGFydEVsID0gdGhpcy5nYW1lVXNlckVsLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgYFtkYXRhLXBvcy1hPVwiJHtjZWxsUG9zQX1cIl1bZGF0YS1wb3MtYj1cIiR7Y2VsbFBvc0J9XCJdYFxyXG4gICAgICApO1xyXG4gICAgICBwYXJ0RWwuY2xhc3NMaXN0LmFkZChcImdhbWUtY2VsbC1zaGlwXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZW5kZXJHYW1lRWxlbWVudChodG1sKSB7XHJcbiAgICB0aGlzLmdhbWVFbC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgaHRtbCk7XHJcbiAgfVxyXG5cclxuICByZW5kZXJQbGF5ZXJUdXJuKG5hbWUpIHtcclxuICAgIGNvbnN0IGh0bWwgPSBgPGRpdiBjbGFzcz1cImdhbWUtdHVyblwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImdhbWUtY3VycmVudC1uYW1lIG9wYXF1ZVwiPiR7bmFtZX0ncyB0dXJuPC9kaXY+XHJcbiAgPC9kaXY+YDtcclxuICAgIHRoaXMucmVuZGVyR2FtZUVsZW1lbnQoaHRtbCk7XHJcbiAgICAvLyB0aGlzLmdhbWVFbC5pbnNlcnRBZGphY2VudEhUTUwoXCJhZnRlcmJlZ2luXCIsIGh0bWwpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyQ3VycmVudFJlc2V0QnRuKGNiKSB7XHJcbiAgICBjb25zdCBodG1sID0gYDxkaXYgY2xhc3M9XCJnYW1lLXJlc2V0XCI+XHJcbiAgICA8YnV0dG9uIGlkPVwicmVzZXQtY3VycmVudC1nYW1lXCIgY2xhc3M9XCJidG4tbWFpblwiID5cclxuICAgIHJlc3RhcnQgZ2FtZVxyXG4gICAgICA8c3ZnXHJcbiAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgICAgICAgdmlld0JveD1cIjAgMCA1MCA1MFwiXHJcbiAgICAgICAgd2lkdGg9XCIxMDBweFwiXHJcbiAgICAgICAgaGVpZ2h0PVwiMTAwcHhcIlxyXG4gICAgICA+XHJcbiAgICAgICAgPHBhdGhcclxuICAgICAgICAgIGQ9XCJNIDI1IDIgQSAyLjAwMDIgMi4wMDAyIDAgMSAwIDI1IDYgQyAzNS41MTcxMjQgNiA0NCAxNC40ODI4NzYgNDQgMjUgQyA0NCAzNS41MTcxMjQgMzUuNTE3MTI0IDQ0IDI1IDQ0IEMgMTQuNDgyODc2IDQ0IDYgMzUuNTE3MTI0IDYgMjUgQyA2IDE5LjUyNDIwMSA4LjMwODAxNzUgMTQuNjA4MTA2IDEyIDExLjE0NDUzMSBMIDEyIDE1IEEgMi4wMDAyIDIuMDAwMiAwIDEgMCAxNiAxNSBMIDE2IDQgTCA1IDQgQSAyLjAwMDIgMi4wMDAyIDAgMSAwIDUgOCBMIDkuNTI1MzkwNiA4IEMgNC45MDY3MDE1IDEyLjIwOTQ4IDIgMTguMjcyMzI1IDIgMjUgQyAyIDM3LjY3ODg3NiAxMi4zMjExMjQgNDggMjUgNDggQyAzNy42Nzg4NzYgNDggNDggMzcuNjc4ODc2IDQ4IDI1IEMgNDggMTIuMzIxMTI0IDM3LjY3ODg3NiAyIDI1IDIgelwiXHJcbiAgICAgICAgPjwvcGF0aD5cclxuICAgICAgPC9zdmc+XHJcbiAgICA8L2J1dHRvbj5cclxuICA8L2Rpdj5gO1xyXG4gICAgdGhpcy5yZW5kZXJHYW1lRWxlbWVudChodG1sKTtcclxuICAgIHRoaXMucmVzZXRDdXJyZW50R2FtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzZXQtY3VycmVudC1nYW1lXCIpO1xyXG4gICAgdGhpcy5yZXNldEN1cnJlbnRHYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYik7XHJcbiAgfVxyXG5cclxuICBjbGVhckN1cnJlbnRSZXNldEJ0bigpIHtcclxuICAgIGNvbnN0IHJlc2V0Q3VycmVudEdhbWVFbCA9IHRoaXMuZ2FtZUVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1yZXNldFwiKTtcclxuICAgIHRoaXMuZ2FtZUVsLnJlbW92ZUNoaWxkKHJlc2V0Q3VycmVudEdhbWVFbCk7XHJcbiAgICB0aGlzLnJlc2V0Q3VycmVudEdhbWUgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJQbGF5ZXJUdXJuKCkge1xyXG4gICAgY29uc3QgZWwgPSB0aGlzLmdhbWVFbC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtdHVyblwiKTtcclxuICAgIGVsLnJlbW92ZSgpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyTWFya2VkQ2VsbChwb3NpdGlvbiwgc2hpcCwgdHlwZSkge1xyXG4gICAgY29uc3QgeyBwb3NBLCBwb3NCIH0gPSBwb3NpdGlvbjtcclxuICAgIGNvbnN0IGdhbWVib2FyZEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodHlwZSk7XHJcblxyXG4gICAgY29uc3QgdGFyZ2V0Q2VsbEVsID0gZ2FtZWJvYXJkRWwucXVlcnlTZWxlY3RvcihcclxuICAgICAgYFtkYXRhLXBvcy1hPVwiJHtwb3NBfVwiXVtkYXRhLXBvcy1iPVwiJHtwb3NCfVwiXWBcclxuICAgICk7XHJcblxyXG4gICAgaWYgKCFzaGlwKSB0YXJnZXRDZWxsRWwuY2xhc3NMaXN0LmFkZChcInJlc2VydmVkXCIpO1xyXG5cclxuICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHNwYW4uY2xhc3NOYW1lID0gc2hpcCA/IFwiaGl0XCIgOiBcIm1pc3NcIjtcclxuXHJcbiAgICB0YXJnZXRDZWxsRWwuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgfVxyXG5cclxuICByZW5kZXJSZXNlcnZlZFBvc2l0aW9ucyh0eXBlLCByZXNlcnZlZFBvc2l0aW9ucykge1xyXG4gICAgY29uc3QgZ2FtZWJvYXJkRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0eXBlKTtcclxuXHJcbiAgICByZXNlcnZlZFBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbikgPT4ge1xyXG4gICAgICBjb25zdCB7IHBvc0EsIHBvc0IgfSA9IHBvc2l0aW9uO1xyXG4gICAgICBjb25zdCBjZWxsRWwgPSBnYW1lYm9hcmRFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgIGBbZGF0YS1wb3MtYT1cIiR7cG9zQX1cIl1bZGF0YS1wb3MtYj1cIiR7cG9zQn1cIl1gXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoIWNlbGxFbC5jbGFzc0xpc3QuY29udGFpbnMoXCJyZXNlcnZlZFwiKSkge1xyXG4gICAgICAgIGNlbGxFbC5jbGFzc0xpc3QuYWRkKFwicmVzZXJ2ZWRcIik7XHJcbiAgICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHNwYW4uY2xhc3NOYW1lID0gXCJtaXNzXCI7XHJcbiAgICAgICAgY2VsbEVsLmFwcGVuZENoaWxkKHNwYW4pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlclN1bmtTaGlwKGlkKSB7XHJcbiAgICBjb25zdCBzaGlwSXRlbUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2hpcC1pZD1cIiR7aWR9XCJdYCk7XHJcbiAgICBzaGlwSXRlbUVsLmNsYXNzTGlzdC5hZGQoXCJzdW5rXCIpO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlUGxheWVyVHVybihuYW1lKSB7XHJcbiAgICBjb25zdCBlbCA9IHRoaXMuZ2FtZUVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1jdXJyZW50LW5hbWVcIik7XHJcbiAgICBlbC50ZXh0Q29udGVudCA9IGAke25hbWV9J3MgdHVybmA7XHJcbiAgICBlbC5jbGFzc0xpc3QuYWRkKFwib3BhcXVlXCIpO1xyXG4gIH1cclxuXHJcbiAgaGlkZVBsYXllclR1cm4oKSB7XHJcbiAgICBjb25zdCBlbCA9IHRoaXMuZ2FtZUVsLnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZS1jdXJyZW50LW5hbWVcIik7XHJcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKFwib3BhcXVlXCIpO1xyXG4gIH1cclxuXHJcbiAgc2hvd1NoaXBQaWNrKCkge1xyXG4gICAgdGhpcy5nYW1lU2hpcEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbiAgfVxyXG5cclxuICBoaWRlU2hpcFBpY2soKSB7XHJcbiAgICB0aGlzLmdhbWVTaGlwRWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICB9XHJcblxyXG4gIHNob3dQbGF5QnV0dG9uKCkge1xyXG4gICAgdGhpcy5wbGF5R2FtZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gIH1cclxuXHJcbiAgaGlkZVBsYXlCdXR0b24oKSB7XHJcbiAgICB0aGlzLnBsYXlHYW1lQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbiAgfVxyXG5cclxuICBzaG93UmVzZXJ2ZWRDZWxscyhib2FyZCkge1xyXG4gICAgdGhpcy5nYW1lYm9hcmRVc2VyRWwucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lLWNlbGxcIikuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICBjb25zdCB7IHBvc0EsIHBvc0IgfSA9IGNlbGwuZGF0YXNldDtcclxuICAgICAgY29uc3QgeyByZXNlcnZlZCB9ID0gYm9hcmRbK3Bvc0FdWytwb3NCXTtcclxuXHJcbiAgICAgIGlmIChyZXNlcnZlZCkge1xyXG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGwtZGlzYWJsZWRcIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaGlkZVJlc2VydmVkQ2VsbHMoYm9hcmQpIHtcclxuICAgIHRoaXMuZ2FtZWJvYXJkVXNlckVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZS1jZWxsXCIpLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgY29uc3QgeyBwb3NBLCBwb3NCIH0gPSBjZWxsLmRhdGFzZXQ7XHJcbiAgICAgIGNvbnN0IHsgcmVzZXJ2ZWQgfSA9IGJvYXJkWytwb3NBXVsrcG9zQl07XHJcblxyXG4gICAgICBpZiAocmVzZXJ2ZWQpIHtcclxuICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJjZWxsLWRpc2FibGVkXCIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZUdhbWVQYW5lbChlbCkge1xyXG4gICAgZWwucXVlcnlTZWxlY3RvcihcIi5nYW1lLXBhbmVsXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJkaXNhYmxlZFwiKTtcclxuICB9XHJcblxyXG4gIHN3aXRjaEdhbWVQYW5lbCgpIHtcclxuICAgIHRoaXMudG9nZ2xlR2FtZVBhbmVsKHRoaXMuZ2FtZUNvbXB1dGVyRWwpO1xyXG4gICAgdGhpcy50b2dnbGVHYW1lUGFuZWwodGhpcy5nYW1lVXNlckVsKTtcclxuICB9XHJcblxyXG4gIGdldENvbXB1dGVyQm9hcmRQb3NpdGlvbihldmVudCkge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG5cclxuICAgIGNvbnN0IGNlbGxFbCA9IHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJnYW1lLWNlbGxcIik7XHJcbiAgICBpZiAoIWNlbGxFbCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHsgcG9zQSwgcG9zQiB9ID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQ7XHJcblxyXG4gICAgcmV0dXJuIHsgcG9zQSwgcG9zQiB9O1xyXG4gIH1cclxuXHJcbiAgLy8gRVZFTlQgRlVOQ1RJT05TXHJcblxyXG4gIG9uQ2xpY2tQbGF5QnRuKGNiKSB7XHJcbiAgICB0aGlzLnBsYXlHYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZ2FtZUNvbnRyb2xzRWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgY2IoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVzZXQgYnV0dG9uIGV2ZW50XHJcbiAgb25DbGlja1Jlc2V0QnRuKGNiKSB7XHJcbiAgICB0aGlzLnJlc2V0U2hpcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBjYigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyByYW5kb20gYnV0dG9uIGV2ZW50XHJcbiAgb25DbGlja1JhbmRvbUJ0bihjYikge1xyXG4gICAgdGhpcy5yYW5kb21TaGlwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIGNiKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIHNoaXAgb2JqZWN0IGVsIGV2ZW50c1xyXG4gIG9uQ2xpY2tTaGlwRWwoY2IpIHtcclxuICAgIHRoaXMuZ2FtZVNoaXBPYmplY3RFbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBjYigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkRyYWdTaGlwRWwoYm9hcmQpIHtcclxuICAgIC8vIHN0YXJ0IGRyYWdnYWJsZVxyXG4gICAgdGhpcy5nYW1lU2hpcE9iamVjdEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgIHRoaXMuZHJhZ2dlZEVsID0gZXZlbnQudGFyZ2V0OyAvLyB0YXJnZXQgZWxlbWVudCwgd2hpY2ggaXMgZHJhZ2dlYmxlXHJcbiAgICAgIHRoaXMuc2hvd1Jlc2VydmVkQ2VsbHMoYm9hcmQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5nYW1lU2hpcE9iamVjdEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW5kXCIsICgpID0+IHtcclxuICAgICAgLy8gZmlyZXMgd2hlbiB1c2VyIGVuIHRvIGRyYWcgZWxlbWVudDtcclxuICAgICAgdGhpcy5oaWRlUmVzZXJ2ZWRDZWxscyhib2FyZCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uRHJvcFNoaXBFbChjYikge1xyXG4gICAgLy8gY29uc3QgZ2FtZUJvYXJkRWwgPSB0aGlzLmdhbWVVc2VyRWwucXVlcnlTZWxlY3RvcihcIi5nYW1lLWJvYXJkXCIpO1xyXG5cclxuICAgIHRoaXMuZ2FtZWJvYXJkVXNlckVsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCAoZXZlbnQpID0+IHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZ2FtZWJvYXJkVXNlckVsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIChldmVudCkgPT4ge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLmRyYWdnZWRFbCB8fCAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImdhbWUtY2VsbFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBjb25zdCB7IHBvc0EsIHBvc0IgfSA9IGV2ZW50LnRhcmdldC5kYXRhc2V0O1xyXG4gICAgICBjb25zdCB7IGRpcmVjdGlvbiB9ID0gdGhpcy5kcmFnZ2VkRWwuZGF0YXNldDtcclxuXHJcbiAgICAgIGNvbnN0IGRhdGFET00gPSB7XHJcbiAgICAgICAgcG9zQSxcclxuICAgICAgICBwb3NCLFxyXG4gICAgICAgIGRpcmVjdGlvbixcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMuZHJhZ2dlZEVsID0gbnVsbDtcclxuXHJcbiAgICAgIGNiKGRhdGFET00pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrQ29tcHV0ZXJHYW1lYm9hcmQoY2IpIHtcclxuICAgIHRoaXMuZ2FtZWJvYXJkQ29tcHV0ZXJFbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2IpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlQ2xpY2tDb21wdXRlckdhbWVib2FyZChjYikge1xyXG4gICAgdGhpcy5nYW1lYm9hcmRDb21wdXRlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBHYW1lcGxheVZpZXc7XHJcbiIsImNsYXNzIE1lbnVWaWV3IHtcclxuICBtZW51RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnVcIik7XHJcbiAgZmllbGRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS1maWVsZFwiKTtcclxuICBpbnB1dEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXJfbmFtZVwiKTtcclxuXHJcbiAgc3RhcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1zdGFydC1nYW1lXCIpO1xyXG5cclxuICBtZW51RXJyb3JFbDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnJlbmRlckljb24oKTtcclxuICAgIHRoaXMuaW5wdXRFbC5mb2N1cygpO1xyXG4gICAgdGhpcy5vbkNoYW5nZUlucHV0KCk7XHJcbiAgICB0aGlzLm1lbnVFcnJvckVsID0gdGhpcy5yZW5kZXJNZW51RXJyb3IoKTtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2tTdGFydEJ1dHRvbihjYWxsYmFjaykge1xyXG4gICAgdGhpcy5zdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBjYWxsYmFjayh0aGlzLmlucHV0RWwudmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzaG93RXJyb3IoKSB7XHJcbiAgICBpZiAoIWRvY3VtZW50LmNvbnRhaW5zKHRoaXMubWVudUVycm9yRWwpKVxyXG4gICAgICB0aGlzLmZpZWxkRWwuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCB0aGlzLm1lbnVFcnJvckVsKTtcclxuICB9XHJcblxyXG4gIHJlbmRlck1lbnVFcnJvcigpIHtcclxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBkaXYuY2xhc3NOYW1lID0gXCJtZW51LWVycm9yXCI7XHJcbiAgICBkaXYudGV4dENvbnRlbnQgPSBcIlVwcyEgWW91IGZvcmdvdCBhIG5hbWUhXCI7XHJcblxyXG4gICAgcmV0dXJuIGRpdjtcclxuICB9XHJcblxyXG4gIGhpZGVTdGFydE1lbnUoKSB7XHJcbiAgICB0aGlzLm1lbnVFbC5jbGFzc0xpc3QucmVtb3ZlKFwic2hvd1wiKTtcclxuICB9XHJcblxyXG4gIHJlbmRlckljb24oKSB7XHJcbiAgICBjb25zdCBzdmcgPSBgPHN2Z1xyXG4gICAgaWQ9XCJ0YXJnZXQtaWNvblwiXHJcbiAgICB3aWR0aD1cIjEwMCVcIlxyXG4gICAgaGVpZ2h0PVwiMTAwJVwiXHJcbiAgICB2aWV3Qm94PVwiMCAwIDE0NC40OTc3NyAxNDQuNDk3NzdcIlxyXG4gICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiXHJcbiAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgIHhtbG5zOnN2Zz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICA+XHJcbiAgICA8ZGVmcyAgLz5cclxuICAgIDxnIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgtMzkuNDA1MjUxLC00Mi40NzU3MzcpXCI+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgc3R5bGU9XCJmaWxsOiAjZmZmZmZmXCJcclxuICAgICAgICBkPVwibSAxMDcuNDIwOCwxODIuNTAxOTcgdiAtNC40Njk1NCBsIC0zLjA5NTcyLC0wLjMzNTc2IEMgOTMuMTgwNzI3LDE3Ni40ODk5NiA4Mi40NDMxNTYsMTcyLjEzMTQ1IDcyLjk4OTY5MiwxNjQuOTc5MjcgNjkuOTA2MTA2LDE2Mi42NDYzMyA2My43MzI0MywxNTYuNDcyNjYgNjEuMzk5NDksMTUzLjM4OTA3IDU0LjI0NzMxLDE0My45MzU2MSA0OS44ODg4MDcsMTMzLjE5ODA0IDQ4LjY4MDA5NiwxMjIuMDUzNjggbCAtMC4zMzU3NiwtMy4wOTU3MiBoIC00LjQ2OTU0MyAtNC40Njk1NDQgdiAtNC4yMzMzMyAtNC4yMzMzNCBoIDQuNDY5NTQ0IDQuNDY5NTQzIGwgMC4zMzU3NiwtMy4wOTU3MiBDIDQ5Ljg4ODgwNyw5Ni4yNTEyMTkgNTQuMjQ3MzEsODUuNTEzNjQ5IDYxLjM5OTQ5LDc2LjA2MDE3OSA2My43MzI0Myw3Mi45NzY1OTkgNjkuOTA2MTA2LDY2LjgwMjkxOSA3Mi45ODk2OTIsNjQuNDY5OTggODIuNDQzMTU2LDU3LjMxNzggOTMuMTgwNzI3LDUyLjk1OTI5NyAxMDQuMzI1MDgsNTEuNzUwNTg3IGwgMy4wOTU3MiwtMC4zMzU3NjEgViA0Ni45NDUyODMgNDIuNDc1NzQgaCA0LjIzMzM0IDQuMjMzMzMgdiA0LjQ2OTU0MyA0LjQ2OTU0MyBsIDMuMDk1NzIsMC4zMzU3NjEgYyAxMS4xNDQzNiwxLjIwODcxIDIxLjg4MTkzLDUuNTY3MjEzIDMxLjMzNTM5LDEyLjcxOTM5MyAzLjA4MzU5LDIuMzMyOTM5IDkuMjU3MjYsOC41MDY2MTkgMTEuNTkwMiwxMS41OTAxOTkgNy4xNTIxOCw5LjQ1MzQ3IDExLjUxMDY5LDIwLjE5MTA0IDEyLjcxOTQsMzEuMzM1MzkxIGwgMC4zMzU3NiwzLjA5NTcyIGggNC40Njk1NCA0LjQ2OTU0IHYgNC4yMzMzNCA0LjIzMzMzIGggLTQuNDY5NTQgLTQuNDY5NTQgbCAtMC4zMzU3NiwzLjA5NTcyIGMgLTEuMjA4NzEsMTEuMTQ0MzYgLTUuNTY3MjIsMjEuODgxOTMgLTEyLjcxOTQsMzEuMzM1MzkgLTIuMzMyOTQsMy4wODM1OSAtOC41MDY2MSw5LjI1NzI2IC0xMS41OTAyLDExLjU5MDIgLTkuNDUzNDYsNy4xNTIxOCAtMjAuMTkxMDMsMTEuNTEwNjkgLTMxLjMzNTM5LDEyLjcxOTQgbCAtMy4wOTU3MiwwLjMzNTc2IHYgNC40Njk1NCA0LjQ2OTU0IGggLTQuMjMzMzMgLTQuMjMzMzQgeiBtIDAsLTIxLjQ1OTA0IHYgLTguNDMwODEgbCAtMi42MTA1NSwtMC40NzU0NiBjIC01LjEwNzExMSwtMC45MzAxNCAtMTAuNDE0OTExLC0zLjEzMTg5IC0xNC44NTUzMzMsLTYuMTYyMTggLTIuNzU5MjIzLC0xLjg4Mjk5IC03LjY2OTY0NywtNi43OTM0MSAtOS41NTI2MzQsLTkuNTUyNjQgLTMuMDMwMjk0LC00LjQ0MDQyIC01LjIzMjAzOSwtOS43NDgyMiAtNi4xNjIxODUsLTE0Ljg1NTMyIGwgLTAuNDc1NDU1LC0yLjYxMDU2IGggLTguNDY3Mjc0IC04LjQ2NzI3NSBsIDAuMjAwMDc4LDIuMDQ2MTEgYyAxLjg3NTUxMiwxOS4xODAwOSAxNS40MzMxNDIsMzcuMTAzNTYgMzMuNzM5NTIsNDQuNjA0MzUgNC43NjkwMDEsMS45NTQwMyAxMS43NzQxODgsMy42NzI0NiAxNS41OTI3NzgsMy44MjUwMyBsIDEuMDU4MzMsMC4wNDIzIHogbSAxNS4xOTY0NCw3LjU2MjQ4IGMgMjEuNTk1OTEsLTQuNDMwNTEgMzguNDg5MTcsLTIxLjMyMzc3IDQyLjkxOTY4LC00Mi45MTk2OCAwLjI5NzYxLC0xLjQ1MDY1IDAuNjMxMTQsLTMuNTU4MyAwLjc0MTE4LC00LjY4MzY2IGwgMC4yMDAwOCwtMi4wNDYxMSBoIC04LjQ2NzI4IC04LjQ2NzI3IGwgLTAuNDc1NDYsMi42MTA1NiBjIC0wLjkzMDE0LDUuMTA3MSAtMy4xMzE4OSwxMC40MTQ5IC02LjE2MjE4LDE0Ljg1NTMyIC0xLjg4Mjk5LDIuNzU5MjMgLTYuNzkzNDEsNy42Njk2NSAtOS41NTI2Myw5LjU1MjY0IC00LjQ0MDQzLDMuMDMwMjkgLTkuNzQ4MjMsNS4yMzIwNCAtMTQuODU1MzMsNi4xNjIxOCBsIC0yLjYxMDU2LDAuNDc1NDYgdiA4LjQ2NzI3IDguNDY3MjggbCAyLjA0NjExLC0wLjIwMDA4IGMgMS4xMjUzNiwtMC4xMTAwNCAzLjIzMzAxLC0wLjQ0MzU4IDQuNjgzNjYsLTAuNzQxMTggeiBtIC0xNS4xOTY0NCwtMjguNjIzOSB2IC00LjA5MjIyIGggNC4yMzMzNCA0LjIzMzMzIHYgNC4xMDUwMSA0LjEwNTAxIGwgMS4wNTgzMywtMC4xODM4NyBjIDAuNTgyMDksLTAuMTAxMTIgMi40Mjk2LC0wLjYzMjMgNC4xMDU1OCwtMS4xODAzOCA4Ljc2NDM3LC0yLjg2NjE2IDE1Ljc0OTA0LC05Ljg1MDgyIDE4LjYxNTE5LC0xOC42MTUxOSAwLjU0ODA4LC0xLjY3NTk4IDEuMDc5MjYsLTMuNTIzNDkgMS4xODAzOSwtNC4xMDU1OCBsIDAuMTgzODYsLTEuMDU4MzMgaCAtNC4xMDUwMSAtNC4xMDUwMSB2IC00LjIzMzMzIC00LjIzMzM0IGggNC4xMDUwMSA0LjEwNTAxIGwgLTAuMTgzODYsLTEuMDU4MzMgYyAtMC4xMDExMywtMC41ODIwOCAtMC42MzIzMSwtMi40Mjk1OSAtMS4xODAzOSwtNC4xMDU1OCAtMi44NjYxNSwtOC43NjQzNjEgLTkuODUwODIsLTE1Ljc0OTAzMSAtMTguNjE1MTksLTE4LjYxNTE4MSAtMS42NzU5OCwtMC41NDgwOSAtMy41MjM0OSwtMS4wNzkyNiAtNC4xMDU1OCwtMS4xODAzOSBsIC0xLjA1ODMzLC0wLjE4Mzg3IHYgNC4xMDUwMSA0LjEwNTAxIGggLTQuMjMzMzMgLTQuMjMzMzQgdiAtNC4xMDUwMSAtNC4xMDUwMSBsIC0xLjA1ODMzLDAuMTgzODcgYyAtMC41ODIwOCwwLjEwMTEzIC0yLjQyOTU5LDAuNjMyMyAtNC4xMDU1OCwxLjE4MDM5IC04Ljc2NDM2NCwyLjg2NjE1IC0xNS43NDkwMzMsOS44NTA4MiAtMTguNjE1MTg0LDE4LjYxNTE4MSAtMC41NDgwODYsMS42NzU5OSAtMS4wNzkyNjEsMy41MjM1IC0xLjE4MDM4OSw0LjEwNTU4IGwgLTAuMTgzODY4LDEuMDU4MzMgaCA0LjEwNTAxIDQuMTA1MDExIHYgNC4yMzMzNCA0LjIzMzMzIGggLTQuMTA1MDExIC00LjEwNTAxIGwgMC4xODM4NjgsMS4wNTgzMyBjIDAuNzAyMTUxLDQuMDQxNTIgMy4yMjcyMTQsOS41MzQyNiA2LjA4NzExMSwxMy4yNDEyMiAyLjcwMjA2MSwzLjUwMjM3IDcuNzYzMTUyLDcuMjYwNTkgMTEuOTU3NTEyLDguODc5MjkgMi4xMTczNSwwLjgxNzEzIDUuNzczMDIsMS44ODg2NCA2LjU2MjA5LDEuOTIzNCAwLjI2NjcxLDAuMDExOCAwLjM1Mjc3LC0wLjk4Mjc3IDAuMzUyNzcsLTQuMDc2NjkgeiBtIDEuNzIzOTEsLTEyLjg2NDE0IGMgLTYuNDEwNDMsLTEuMjU4OTMgLTExLjAyNTcwOSwtNy44NTg0MSAtOS45NjYzOTksLTE0LjI1MTE0IDAuOTE3NDI5LC01LjUzNjQ5IDUuMDgyOTM5LC05LjcwMiAxMC42MTk0MjksLTEwLjYxOTQzIDguMTYwNzQsLTEuMzUyMjggMTUuNjg0NSw2LjE3MTQ4IDE0LjMzMjIyLDE0LjMzMjIzIC0xLjE5MTYsNy4xOTEwOCAtNy45MjM0MSwxMS45MjUyMSAtMTQuOTg1MjUsMTAuNTM4MzQgeiBNIDc0LjI0MDA5OCwxMDcuODgwNzQgYyAwLjkzMDE0NiwtNS4xMDcxMSAzLjEzMTg5MSwtMTAuNDE0OTExIDYuMTYyMTg1LC0xNC44NTUzMzEgMS44ODI5ODcsLTIuNzU5MjMgNi43OTM0MTEsLTcuNjY5NjUgOS41NTI2MzQsLTkuNTUyNjQgNC40NDA0MjIsLTMuMDMwMjkgOS43NDgyMjIsLTUuMjMyMDMgMTQuODU1MzMzLC02LjE2MjE4IGwgMi42MTA1NSwtMC40NzU0NiB2IC04LjQ2NzI3IC04LjQ2NzI3NCBsIC0yLjA0NjExLDAuMjAwMDc3IEMgOTUuODU0Nzc4LDYxLjAzMTU2IDg1LjU0NDg0OSw2NS4yODYwNzYgNzcuNjk3NzM4LDcxLjUyMTg4OSA2Ni4wOTE5NTksODAuNzQ0NTc5IDU4LjM5NDA3Niw5NC40OTcwOTkgNTcuMDMwMTcyLDEwOC40NDUxOCBsIC0wLjIwMDA3OCwyLjA0NjExIGggOC40NjcyNzUgOC40NjcyNzQgeiBtIDkyLjAzODAwMiwwLjU2NDQ0IEMgMTY0LjkxNDIsOTQuNDk3MDk5IDE1Ny4yMTYzMSw4MC43NDQ1NzkgMTQ1LjYxMDU0LDcxLjUyMTg4OSAxMzcuNzYzNDIsNjUuMjg2MDc2IDEyNy40NTM0OSw2MS4wMzE1NiAxMTcuOTMzNTgsNjAuMTAwNjYyIGwgLTIuMDQ2MTEsLTAuMjAwMDc3IHYgOC40NjcyNzQgOC40NjcyNyBsIDIuNjEwNTYsMC40NzU0NiBjIDUuMTA3MSwwLjkzMDE1IDEwLjQxNDksMy4xMzE4OSAxNC44NTUzMyw2LjE2MjE4IDIuNzU5MjIsMS44ODI5OSA3LjY2OTY0LDYuNzkzNDEgOS41NTI2Myw5LjU1MjY0IDMuMDMwMjksNC40NDA0MiA1LjIzMjA0LDkuNzQ4MjIxIDYuMTYyMTgsMTQuODU1MzMxIGwgMC40NzU0NiwyLjYxMDU1IGggOC40NjcyNyA4LjQ2NzI4IHpcIlxyXG4gICAgICAvPlxyXG4gICAgPC9nPlxyXG4gIDwvc3ZnPmA7XHJcblxyXG4gICAgdGhpcy5tZW51RWwuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIHN2Zyk7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZUlucHV0KCkge1xyXG4gICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xyXG4gICAgICBpZiAoZS50YXJnZXQudmFsdWUgJiYgZG9jdW1lbnQuY29udGFpbnModGhpcy5tZW51RXJyb3JFbCkpXHJcbiAgICAgICAgdGhpcy5maWVsZEVsLnJlbW92ZUNoaWxkKHRoaXMubWVudUVycm9yRWwpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNZW51VmlldztcclxuIiwiY2xhc3MgTW9kYWxWaWV3IHtcclxuICBtb2RhbEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbFwiKTtcclxuICByZXN1bHRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzdWx0XCIpO1xyXG4gIGRlc2NFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY1wiKTtcclxuICByZXN0YXJ0QnRuRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3RhcnRcIik7XHJcblxyXG4gIHRvZ2dsZU1vZGFsKCkge1xyXG4gICAgdGhpcy5tb2RhbEVsLmNsYXNzTGlzdC50b2dnbGUoXCJoaWRkZW5cIik7XHJcbiAgfVxyXG5cclxuICBhbmltYXRlTW9kYWwoKSB7XHJcbiAgICB0aGlzLm1vZGFsRWwuY2xhc3NMaXN0LnRvZ2dsZShcIm9wYXF1ZVwiKTtcclxuICB9XHJcblxyXG4gIHJlbmRlckdhbWVSZXN1bHQobmFtZSkge1xyXG4gICAgdGhpcy5yZXN1bHRFbC50ZXh0Q29udGVudCA9IG5hbWUgPT09IFwiY29tcHV0ZXJcIiA/IFwiRGVmZWF0IVwiIDogXCJWaWN0b3J5IVwiO1xyXG4gICAgdGhpcy5kZXNjRWwudGV4dENvbnRlbnQgPSBgJHtuYW1lfSBoYXMgd29uIWA7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrUmVzdGFydEJ0bihjYikge1xyXG4gICAgdGhpcy5yZXN0YXJ0QnRuRWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNiKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUNsaWNrUmVzdGFydEJ0bihjYikge1xyXG4gICAgdGhpcy5yZXN0YXJ0QnRuRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1vZGFsVmlldztcclxuIiwiZXhwb3J0IGNvbnN0IFNISVBfU0laRVMgPSBbNCwgNCwgMywgMywgMiwgMiwgMSwgMV07XHJcblxyXG5leHBvcnQgY29uc3QgQ1VTVE9NX0FMUEhBQkVUID0gXCIxMjM0NTY3ODkwYWJjZGVmXCI7XHJcbmV4cG9ydCBjb25zdCBTSVpFX0lEID0gMTA7XHJcblxyXG5leHBvcnQgY29uc3QgSE9SSVpPTlRBTCA9IFwiaG9yaXpvbnRhbFwiO1xyXG5leHBvcnQgY29uc3QgVkVSVElDQUwgPSBcInZlcnRpY2FsXCI7XHJcblxyXG5leHBvcnQgY29uc3QgVElNRV9PVVQgPSAxO1xyXG5leHBvcnQgY29uc3QgVElNRV9ERUxBWSA9IDAuMzU7XHJcbiIsImNvbnN0IGNvbmNhdE51bWJlcnMgPSAocG9zKSA9PiB7XHJcbiAgY29uc3QgeyBwb3NBLCBwb3NCIH0gPSBwb3M7XHJcblxyXG4gIGNvbnN0IHN0ciA9IFwiXCIgKyBwb3NBICsgcG9zQjtcclxuXHJcbiAgcmV0dXJuIE51bWJlcihzdHIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGJpbmFyeVNlYXJjaCA9IGZ1bmN0aW9uIChhcnIsIGluZGV4KSB7XHJcbiAgbGV0IGxlZnQgPSAwO1xyXG4gIGxldCByaWdodCA9IGFyci5sZW5ndGggLSAxO1xyXG4gIGxldCBtaWQ7XHJcblxyXG4gIGNvbnN0IGluZGV4TnVtYmVyID0gY29uY2F0TnVtYmVycyhpbmRleCk7XHJcblxyXG4gIHdoaWxlIChyaWdodCA+PSBsZWZ0KSB7XHJcbiAgICBtaWQgPSBsZWZ0ICsgTWF0aC5mbG9vcigocmlnaHQgLSBsZWZ0KSAvIDIpO1xyXG5cclxuICAgIC8vIGlmIHRoZSBlbGVtZW50IGlzIHByZXNlbnQgYXQgdGhlIG1pZGRsZSBpdHNlZlxyXG5cclxuICAgIGNvbnN0IG1pZE51bWJlciA9IGNvbmNhdE51bWJlcnMoYXJyW21pZF0pO1xyXG4gICAgaWYgKG1pZE51bWJlciA9PT0gaW5kZXhOdW1iZXIpIHJldHVybiBtaWQ7XHJcblxyXG4gICAgLy8gaWYgZWxlbWVudCBpcyBzbWFsbGVkIHRoZW4gbWlkLCB0aGVuXHJcbiAgICAvLyBpdCBjYW4gb25seSBiZSBwcmVzZW50IGluIHRoZSBsZWZ0IHN1YmFhcmF5XHJcbiAgICBpZiAobWlkTnVtYmVyID4gaW5kZXhOdW1iZXIpIHJpZ2h0ID0gbWlkIC0gMTtcclxuICAgIC8vIG90aGVyd2lzZSB0aGUgZWxlbWVudCBjYW4gb25seSBiZSBwcmVzZW50XHJcbiAgICAvLyBpbiB0aGUgcmlnaHQgc3ViYXJyYXlcclxuICAgIGVsc2UgbGVmdCA9IG1pZCArIDE7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gLTE7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0UmFuZG9tTnVtYmVyID0gKG1heCkgPT4ge1xyXG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHNsZWVwID0gKHMpID0+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgcyAqIDEwMDApKTtcclxuICAvLyByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAvLyAgIHNldFRpbWVvdXQoKCkgPT4ge30sIHMpO1xyXG4gIC8vIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbmZpcm1DdXJyZW50UmVzZXRHYW1lID0gKCkgPT4ge1xyXG4gIHJldHVybiBjb25maXJtKFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlc3RhcnQgdGhlIGdhbWU/XCIpO1xyXG59O1xyXG4iLCJleHBvcnQgeyB1cmxBbHBoYWJldCB9IGZyb20gJy4vdXJsLWFscGhhYmV0L2luZGV4LmpzJ1xuZXhwb3J0IGxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcbmV4cG9ydCBsZXQgY3VzdG9tUmFuZG9tID0gKGFscGhhYmV0LCBkZWZhdWx0U2l6ZSwgZ2V0UmFuZG9tKSA9PiB7XG4gIGxldCBtYXNrID0gKDIgPDwgKE1hdGgubG9nKGFscGhhYmV0Lmxlbmd0aCAtIDEpIC8gTWF0aC5MTjIpKSAtIDFcbiAgbGV0IHN0ZXAgPSAtfigoMS42ICogbWFzayAqIGRlZmF1bHRTaXplKSAvIGFscGhhYmV0Lmxlbmd0aClcbiAgcmV0dXJuIChzaXplID0gZGVmYXVsdFNpemUpID0+IHtcbiAgICBsZXQgaWQgPSAnJ1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc3RlcClcbiAgICAgIGxldCBqID0gc3RlcFxuICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdIHx8ICcnXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IHNpemUpIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZXhwb3J0IGxldCBjdXN0b21BbHBoYWJldCA9IChhbHBoYWJldCwgc2l6ZSA9IDIxKSA9PlxuICBjdXN0b21SYW5kb20oYWxwaGFiZXQsIHNpemUsIHJhbmRvbSlcbmV4cG9ydCBsZXQgbmFub2lkID0gKHNpemUgPSAyMSkgPT5cbiAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShzaXplKSkucmVkdWNlKChpZCwgYnl0ZSkgPT4ge1xuICAgIGJ5dGUgJj0gNjNcbiAgICBpZiAoYnl0ZSA8IDM2KSB7XG4gICAgICBpZCArPSBieXRlLnRvU3RyaW5nKDM2KVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA8IDYyKSB7XG4gICAgICBpZCArPSAoYnl0ZSAtIDI2KS50b1N0cmluZygzNikudG9VcHBlckNhc2UoKVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA+IDYyKSB7XG4gICAgICBpZCArPSAnLSdcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgKz0gJ18nXG4gICAgfVxuICAgIHJldHVybiBpZFxuICB9LCAnJylcbiIsImV4cG9ydCBjb25zdCB1cmxBbHBoYWJldCA9XG4gICd1c2VhbmRvbS0yNlQxOTgzNDBQWDc1cHhKQUNLVkVSWU1JTkRCVVNIV09MRl9HUVpiZmdoamtscXZ3eXpyaWN0J1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgaW5pdCBmcm9tIFwiLi9qcy9tb2R1bGVzL2NvbnRyb2xsZXJcIjtcclxuaW1wb3J0IFwiLi9zYXNzL21haW4uc2Nzc1wiO1xyXG5cclxuaW5pdCgpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=