class ModalView {
  modalEl = document.querySelector(".modal");
  resultEl = document.querySelector(".result");
  restartBtnEl = document.getElementById("restart");

  toggleModal() {
    this.modalEl.classList.toggle("hidden");
  }

  renderGameResult(name) {
    this.resultEl.textContent = `${name} has won!`;
  }

  onClickRestartBtn(cb) {
    this.restartBtnEl.addEventListener("click", cb);
  }

  removeClickRestartBtn(cb) {
    this.restartBtnEl.removeEventListener("click", cb);
  }
}

export default ModalView;
