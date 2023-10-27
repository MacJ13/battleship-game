import Player from "./player";

class User extends Player {
  name;

  constructor() {
    super();
  }

  getType() {
    return "user";
  }

  getName() {
    return this.name || "Unknown";
  }

  setName(name) {
    this.name = name;
  }
}

export default User;
