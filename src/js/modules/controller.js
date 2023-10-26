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

// function make gameplay between user and computer
const playGame = (event) => {
  if (game.getTimer()) return;
  const position = gameplayView.getComputerBoardPosition(event);
  if (!position) return;
  console.log(position);
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
