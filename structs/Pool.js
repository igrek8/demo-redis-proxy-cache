const Deferred = require("./Deferred");
const Queue = require("./Queue");

module.exports = class Pool {
  /**
   * @param {number} size a number of concurrent processes
   */
  constructor(size) {
    if (!Number.isInteger(size)) {
      throw new Error(`Expected size to be an integer`);
    }
    if (size <= 0) {
      throw new Error("Expected size to be >= 1");
    }
    this._size = size;
    this._queue = new Queue();
    this._mut = null;
    this._count = 0;
    this._start();
  }

  /**
   * Enqueues the task for execution
   * @param {() => Promise<void>} callable - an async function to schedule
   */
  run(callable) {
    if (typeof callable === "function") {
      const deferred = new Deferred();
      this._queue.push({ deferred, callable });
      if (this._mut) this._mut.resolve();
      return deferred.promise;
    }
    throw new Error("Expected to run callable item");
  }

  /**
   * Display a number of pending tasks in the queue
   */
  size() {
    return this._queue.size();
  }

  async _exec({ deferred, callable }) {
    try {
      this._count++;
      const res = await callable();
      deferred.resolve(res);
    } catch (err) {
      deferred.reject(err);
    } finally {
      this._count--;
    }
  }

  async _start() {
    while (true) {
      const threads = [];
      const next = this._size - this._count;
      for (let i = 0; i < next; i++) {
        // pop from the queue
        const task = this._queue.lpop();
        if (task) threads.push(this._exec(task));
      }
      if (threads.length > 0) {
        // wait if at least one changes the state
        await Promise.race(threads);
      } else {
        // if queue is empty then block until the next run()
        this._mut = new Deferred();
        await this._mut.promise;
      }
    }
  }
};
