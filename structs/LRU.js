class Node {
  constructor(key, value, next = null, prev = null) {
    this.key = key;
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}

class LRU {
  /**
   * @param {{ capacity: number, ttl: number }} param0
   */
  constructor({ capacity, ttl }) {
    if (!Number.isInteger(capacity)) {
      throw new Error(`Expected capacity to be an integer`);
    }
    if (capacity <= 0) {
      throw new Error(`Expected capacity >= 1`);
    }
    if (!Number.isInteger(ttl)) {
      throw new Error(`Expected ttl to be an integer`);
    }
    if (ttl < 0) {
      throw new Error(`Expected ttl to be >= 0`);
    }
    this._size = 0;
    this._ttl = ttl;
    this._capacity = capacity;
    this._head = null;
    this._tail = null;
    this._cache = {};
    this._timers = {};
  }

  _expire(key) {
    return setTimeout(() => this._remove(key), this._ttl);
  }

  /**
   * Creates an expiring key/value record
   * @param {string} key
   * @param {any} value
   */
  write(key, value) {
    this._ensureLimit();
    if (this._head) {
      const node = new Node(key, value, this._head);
      this._head.prev = node;
      this._head = node;
    } else {
      this._head = this._tail = new Node(key, value);
    }
    this._timers[key] = this._expire(key);
    this._cache[key] = this._head;
    this._size++;
  }

  /**
   * Reads from the cache and resets ttl.
   * It may return LRU.NotFound if key is not present
   * @param {string} key
   */
  read(key) {
    const node = this._cache[key];
    if (node) {
      const { value } = node;
      this._remove(key);
      this.write(key, value);
      return value;
    }
    return null;
  }

  _ensureLimit() {
    if (this._size === this._capacity) {
      this._remove(this._tail.key);
    }
  }

  _remove(key) {
    const node = this._cache[key];
    if (node) {
      if (node.prev === null) {
        this._head = node.next;
      } else {
        node.prev.next = node.next;
      }
      if (node.next === null) {
        this._tail = node.prev;
      } else {
        node.next.prev = node.prev;
      }
      clearTimeout(this._timers[key]);
      delete this._timers[key];
      delete this._cache[key];
      this._size--;
    }
  }

  clear() {
    this._head = null;
    this._tail = null;
    this._size = 0;
    this._cache = {};
    Object.values(this._timers).forEach(clearTimeout);
    this._timers = {};
  }

  *[Symbol.iterator]() {
    let node = this._head;
    while (node) {
      yield node;
      node = node.next;
    }
  }
}

module.exports = LRU;
