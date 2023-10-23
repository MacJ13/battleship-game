import Game from "./model/game";
import GameplayView from "./view/gameplayView";
import MenuView from "./view/menuView";

const menuView = new MenuView();
const gameplayView = new GameplayView();
const game = new Game();

const startGame = (name) => {
  const players = game.getPlayers();
  const ship = game.getQueueShip();
  const count = game.getCurrentShipLeft();
  game.setUserPlayerName(name);

  gameplayView.renderGameplay(players);
  gameplayView.renderShipPick(ship, count);
};

const init = () => {
  menuView.onClickStartButton(startGame);
};

export default init;
