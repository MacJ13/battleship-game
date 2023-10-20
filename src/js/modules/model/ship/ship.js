class Ship {
  length;
  hits = 0;
  reservedPositions = [];

  constructor(l) {
    this.length = l;
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
