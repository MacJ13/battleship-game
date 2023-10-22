class MenuView {
  menuEl = document.querySelector(".menu");
  inputEl = document.getElementById("player_name");
  startBtn = document.getElementById("btn-start-game");

  onClickStartButton(callback) {
    this.startBtn.addEventListener("click", () => {
      callback(this.inputEl.value);
      this.menuEl.classList.remove("show");
    });
  }
}

export default MenuView;
