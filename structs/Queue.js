class Node {
  constructor(value, next = null, prev = null) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}

module.exports = class Deque {
  constructor() {
    this._head = null;
    this._tail = null;
    this._size = 0;
  }

  push(value) {
    this._size++;
    if (this._head === null) {
      const node = new Node(value);
      this._head = node;
      this._tail = node;
      return node;
    }
    const node = new Node(value);
    node.prev = this._tail;
    this._tail.next = node;
    this._tail = node;
    return node;
  }

  _remove(node) {
    this._size--;
    let prev = node.prev;
    let next = node.next;
    if (this._head === node) this._head = next;
    if (next) next.prev = prev;
    node.next = null;
    return node.value;
  }

  lpop() {
    if (!this._head) return null;
    return this._remove(this._head);
  }

  size() {
    return this._size;
  }

  *[Symbol.iterator]() {
    let node = this._head;
    while (node) {
      yield node.value;
      node = node.next;
    }
  }
};
