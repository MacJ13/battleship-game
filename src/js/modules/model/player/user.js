import { Queue } from "../ship/ship";
import Player from "./player";

class User extends Player {
  name;

  constructor(type = "user") {
    super(type);
  }

  getName() {
    return this.name || "Unknown";
  }

  setName(name) {
    this.name = name;
  }
}

export default User;
