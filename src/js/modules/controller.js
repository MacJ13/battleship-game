import Game from "./model/game";
import GameplayView from "./view/gameplayView";
import MenuView from "./view/menuView";

const menuView = new MenuView();
const gameplayView = new GameplayView();
const game = new Game();

const resetGameboard = () => {
  const user = game.getCurrentPlayer();

  user.clearPlayerBoard();
  game.addQueueShips();
  gameplayView.hidePlayButton();
  gameplayView.renderGameboardRandom(user.getPlayerBoard());
  gameplayView.renderShipPick(
    game.getQueueShip(),
    game.getCurrentShipLeft(),
    game.getGameboardDirection()
  );
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
  const direction = game.getGameboardDirection();
  let ship = game.getQueueShip();

  const onBoard = user.addShipOnPlayerGameboard(posA, posB, ship);

  if (!onBoard) return;

  gameplayView.renderGameboardShip(data, ship);
  game.dequeShip();
  gameplayView.renderShipPick(
    game.getQueueShip(),
    game.getCurrentShipLeft(),
    direction
  );
};

const changeShipDirection = () => {
  game.changeGameboardDirection();
  const ship = game.getQueueShip();
  const count = game.getCurrentShipLeft();
  const direction = game.getGameboardDirection();

  gameplayView.renderShipPick(ship, count, direction);
};

// function update game state
const updateGame = (ship) => {
  // check if ship exists on cell,
  if (!ship) {
    // game.switchPlayers();
    return;
  }
  const currentPlayer = game.getCurrentPlayer();
  // const enemyPlayer = game.getEnemyPlayer();

  if (!game.userPlaying())
    // we draw random position around target ship
    currentPlayer.checkShipHitting(ship);

  // check if targetShip is full Sunk
  if (ship.getSunk()) {
    // check action for computer play
    if (!game.userPlaying()) {
      currentPlayer.uncheckShipHitting(); //after unchecking these settings we draw random position on board
      currentPlayer.clearPotentialShipPositions(); // we not need potential position after sunk ship around ship fields on enemy board
      // we remove also reserved positions around ship fields from potential computer positions
    }

    // set reserved cells as marked
    //
  }

  // make actions with exist ship to note on hit boat on
  // if(!game.userPlaying())
  // // we
};

const attackGameboard = (position) => {
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

  if (game.userPlaying()) return;

  // game.setTimer(playComputer);
  // ADD SET TIEMOUT FOR COMPUTER PLAYER
};

// function make gameplay between user and computer
const playGame = (event) => {
  if (game.getTimer()) return;
  const position = gameplayView.getComputerBoardPosition(event);
  if (!position) return;
  console.log(position);
  attackGameboard(position);
};

const runGame = () => {
  const user = game.getCurrentPlayer();
  const computer = game.getEnemyPlayer();
  computer.addRandomShipsPosition();
  computer.addGameboardPositions();

  gameplayView.renderPlayerTurn(user.getName());
  gameplayView.onClickComputerGameboard(playGame);
};

const startGame = (name) => {
  const players = game.getPlayers();
  const ship = game.getQueueShip();
  const count = game.getCurrentShipLeft();
  const playerGameboard = game.getCurrentPlayerGameboard();
  const direction = game.getGameboardDirection();
  game.setUserPlayerName(name);

  gameplayView.renderGameplay(players);
  gameplayView.renderShipPick(ship, count, direction);

  gameplayView.onClickShipEl(changeShipDirection);
  gameplayView.onDragShipEl(playerGameboard);
  gameplayView.onDropShipEl(addShipPosition);

  gameplayView.onClickRandomBtn(addShipPositionRandom);
  gameplayView.onClickResetBtn(resetGameboard);
  gameplayView.onClickPlayBtn(runGame);
};

const init = () => {
  menuView.onClickStartButton(startGame);
};

export default init;
