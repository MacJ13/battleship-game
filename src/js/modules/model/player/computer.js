import Player from "./player";

class Computer extends Player {
  availablePositions = [];
  shipHit = false;
  ship;
  position;

  constructor(type = "computer") {
    super(type);
  }

  getName() {
    return "computer";
  }
}

export default Computer;
