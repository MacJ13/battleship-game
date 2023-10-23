import Game from "./model/game";
import GameplayView from "./view/gameplayView";
import MenuView from "./view/menuView";

const menuView = new MenuView();
const gameplayView = new GameplayView();
const game = new Game();

const addShipOnBoard = (data) => {
  const { posA, posB } = data;
  const user = game.getCurrentPlayer();
  const direction = game.getGameboardDirection();
  let ship = game.getQueueShip();

  const onBoard = user.addShipOnPlayerGameboard(posA, posB, ship);

  if (!onBoard) return;

  gameplayView.renderGameboardShip(data, ship);
  game.dequeShip();
  ship = game.getQueueShip();
  gameplayView.renderShipPick(ship, game.getCurrentShipLeft(), direction);
};

const startGame = (name) => {
  const players = game.getPlayers();
  const ship = game.getQueueShip();
  const count = game.getCurrentShipLeft();
  game.setUserPlayerName(name);

  gameplayView.renderGameplay(players);
  gameplayView.renderShipPick(ship, count, direction);
};

const init = () => {
  menuView.onClickStartButton(startGame);
};

export default init;
