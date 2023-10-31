import { sleep } from "../utils/helpers";
import Game from "./model";
import GameplayView from "./view/gameplayView";
import MenuView from "./view/menuView";
import ModalView from "./view/modalView";

const menuView = new MenuView();
const gameplayView = new GameplayView();
const modalView = new ModalView();
const game = new Game();

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
  await sleep(0.5);
  modalView.animateModal();
};

// function update game state
const updateGame = async (ship) => {
  // check if ship exists on cell,
  if (!ship) {
    game.switchPlayers();
    gameplayView.switchGamePanel();
    gameplayView.changePlayerTurn(game.getCurrentName());
    gameplayView.showPlayerTurn();
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
  await sleep(0.75);
  modalView.toggleModal();
};

const init = () => {
  menuView.onClickStartButton(startGame);
  modalView.onClickRestartBtn(restartGame);
};

export default init;
