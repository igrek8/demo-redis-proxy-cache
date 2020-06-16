const Queue = require("./Queue");

test("Queue push/lpop", () => {
  const queue = new Queue();
  expect([...queue]).toEqual([]);
  queue.push(1);
  expect([...queue]).toEqual([1]);
  queue.push(2);
  expect([...queue]).toEqual([1, 2]);
  queue.push(3);
  expect([...queue]).toEqual([1, 2, 3]);
  queue.lpop();
  expect([...queue]).toEqual([2, 3]);
  queue.lpop();
  expect([...queue]).toEqual([3]);
  queue.lpop();
  expect([...queue]).toEqual([]);
});
