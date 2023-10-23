import Player from "./player";

class Computer extends Player {
  constructor(type = "computer") {
    super(type);
  }

  getName() {
    return "computer";
  }
}

export default Computer;
