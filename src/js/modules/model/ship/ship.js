import { customAlphabet } from "nanoid";
import { CUSTOM_ALPHABET, SIZE_ID } from "../../../utils/constants";

class Ship {
  id;
  length;
  hits = 0;
  reservedPositions = [];

  constructor(l) {
    this.length = l;
    this.id = this.createCustomID();
  }

  getID() {
    return this.id;
  }

  getLength() {
    return this.length;
  }

  getHits() {
    return this.hits;
  }

  getSunk() {
    return this.hits === this.length;
  }

  getReservedPositions() {
    return this.reservedPositions;
  }

  createCustomID() {
    let nanoid = customAlphabet(CUSTOM_ALPHABET, SIZE_ID);
    return nanoid();
  }

  clearReservedPositions() {
    this.reservedPositions.length = 0;
  }

  addReservedPositions(pos) {
    this.reservedPositions.push(pos);
  }

  receiveHit() {
    if (this.hits < this.length) {
      this.hits++;
    }
  }
}

export default Ship;
