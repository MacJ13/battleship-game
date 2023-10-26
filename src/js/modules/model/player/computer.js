import ShipPosition from "../shipPosition/shipPosition";
import Player from "./player";

class Computer extends Player {
  availablePositions = [];
  shipHit = false;
  ship;
  position;
  potentialShipPositions = new ShipPosition();

  constructor(type = "computer") {
    super(type);
  }

  getName() {
    return "computer";
  }
}

export default Computer;
