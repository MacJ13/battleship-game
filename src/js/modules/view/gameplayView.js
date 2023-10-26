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

    this.showGameplay();
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
      const isSunk = ships[i].getSunk();
      const shipLength = ships[i].getLength();

      const cls = isSunk ? "game-item-ship sunk" : "game-item-ship";

      li.className = cls;

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
      this.showPlayButton();
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

  renderGameboardShip(dataBoard, ship) {
    const { posA, posB, direction } = dataBoard;

    for (let i = 0; i < ship.getLength(); i++) {
      const cellPosA = direction === "vertical" ? i * 1 + +posA : +posA;
      const cellPosB = direction == "vertical" ? +posB : +posB + i * 1;
      console.log({ cellPosA, cellPosB });
      const partEl = this.gameUserEl.querySelector(
        `[data-pos-a="${cellPosA}"][data-pos-b="${cellPosB}"]`
      );
      partEl.classList.add("game-cell-ship");
    }
  }

  renderPlayerTurn(name) {
    const html = `<div class="game-turn">
    <div class="game-current-name">${name}'s turn</div>
  </div>`;

    this.gameEl.insertAdjacentHTML("beforeend", html);
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

  renderSunkShip(player) {
    const shipListEl = document
      .getElementById(player.getType())
      .querySelector(".game-list-ship");

    this.renderShipList(shipListEl, player.getShips());
  }

  changePlayerTurn(name) {
    const el = this.gameEl.querySelector(".game-current-name");
    el.textContent = `${name}'s turn`;
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
      console.log({ pos: posA + posB }, board[+posA][+posB]);
      const { reserved } = board[+posA][+posB];

      if (reserved) {
        cell.classList.add("reserved");
      }
    });
  }

  hideReservedCells(board) {
    this.gameboardUserEl.querySelectorAll(".game-cell").forEach((cell) => {
      const { posA, posB } = cell.dataset;
      console.log({ pos: posA + posB }, board[+posA][+posB]);
      const { reserved } = board[+posA][+posB];

      if (reserved) {
        cell.classList.remove("reserved");
      }
    });
  }

  getComputerBoardPosition(event) {
    const target = event.target;
    console.dir(target);
    const cellEl = target.classList.contains("game-cell");
    if (!cellEl) return;

    console.log(event.target.dataset);
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

      // console.log(dataDOM);
    });
  }

  onClickComputerGameboard(cb) {
    this.gameboardComputerEl.addEventListener("click", cb);
  }

  removeClickComputerGameboard(cb) {
    this.gameboardComputerEl.removeEventListener("click", cb);
  }
}

export default GameplayView;
