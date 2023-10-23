class GameplayView {
  gameEl = document.querySelector(".game");
  gameUserEl = document.getElementById("user");
  gameComputerEl = document.getElementById("computer");

  gameboardUserEl = this.gameUserEl.querySelector(".game-board");

  gameControlsEl = this.gameUserEl.querySelector(".game-controls");
  gameShipPickEl = this.gameUserEl.querySelector(".game-ship-pick");

  gameShipObjectEl = this.gameUserEl.querySelector(".game-ship-object");
  gameShipAmountEl = this.gameUserEl.querySelector(".game-ship-amount");

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

    this.showGameplay();
  }

  renderPlayername(element, name) {
    const playername = name || "unknown";
    element.textContent = playername + "'s board";
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
      const isSunk = ships[i].getSunk();
      const shipLength = ships[i].getLength();

      const cls = isSunk ? "game-item-ship sunk" : "game-item-ship";

      li.classList.add(cls);

      for (let j = 0; j < shipLength; j++) {
        const span = document.createElement("span");
        span.className = "game-item-part";
        li.appendChild(span);
      }
      el.appendChild(li);
    }
  }

  renderShipPick(ship, count, direction) {
    this.showShipPick();
    this.gameShipObjectEl.innerHTML = "";
    this.gameShipObjectEl.setAttribute("data-direction", direction);

    if (!ship) {
      this.hideShipPick();

      return;
    }

    const shipLength = ship.getLength();

    for (let i = 0; i < shipLength; i++) {
      const span = document.createElement("span");
      span.className = "game-ship-part";

      this.gameShipObjectEl.appendChild(span);
    }

    if (direction === "horizontal") {
      this.gameShipObjectEl.style.gridTemplateColumns = `repeat(${this.gameShipObjectEl.children.length}, 1fr)`;
    } else {
      this.gameShipObjectEl.style.gridTemplateColumns = `repeat(1, 1fr)`;
    }

    this.gameShipAmountEl.textContent = `x${count}`;
  }

  showShipPick() {
    this.gameShipPickEl.classList.remove("hidden");
  }

  hideShipPick() {
    this.gameShipPickEl.classList.add("hidden");
  }
}

export default GameplayView;
