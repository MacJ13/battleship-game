export class Queue {
  elements = {};
  head = 0;
  tail = 0;

  clearQueue() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }

  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }

  peek() {
    return this.elements[this.head];
  }

  countElement(cb) {
    let count = 0;
    for (const el in this.elements) {
      const current = this.elements[el];
      const condition = cb(current);
      if (condition) break;
      count++;
    }
    return count;
  }

  getLength() {
    return this.tail - this.head;
  }

  isEmpty() {
    return this.getLength() === 0;
  }

  addElements(elements) {
    this.clearQueue();
    for (let el of elements) this.enqueue(el);
  }
}
