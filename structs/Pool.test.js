const Pool = require("./Pool");
const { format } = require("util");

const next = (cb) =>
  new Promise((r) => setImmediate(() => (cb ? r(cb()) : r())));

test("Sequential pool", async () => {
  const pool = new Pool(1);
  const task = jest.fn();
  let a = pool.run(() => next(task.mockReturnValueOnce("a")));
  let b = pool.run(() => next(task.mockReturnValueOnce("b")));
  let c = pool.run(() => next(task.mockReturnValueOnce("c")));
  let d = pool.run(() => next(task.mockReturnValueOnce("d")));
  expect(pool.size()).toBe(4);
  await next();
  await next();
  expect(task).nthReturnedWith(1, "a");
  expect(task).toReturnTimes(1);
  await next();
  expect(task).nthReturnedWith(2, "b");
  expect(task).toReturnTimes(2);
  await next();
  expect(task).nthReturnedWith(3, "c");
  expect(task).toReturnTimes(3);
  await next();
  expect(task).nthReturnedWith(4, "d");
  expect(task).toReturnTimes(4);
  expect(pool.size()).toBe(0);
  const expected = ["a", "b", "c", "d"];
  await expect(Promise.all([a, b, c, d])).resolves.toEqual(expected);
});

test("Concurrent pool", async () => {
  const pool = new Pool(3);
  const task = jest.fn();
  let a = pool.run(() => next(task.mockReturnValueOnce("a")));
  let b = pool.run(() => next(task.mockReturnValueOnce("b")));
  let c = pool.run(() => next(task.mockReturnValueOnce("c")));
  let d = pool.run(() => next(task.mockReturnValueOnce("d")));
  expect(pool.size()).toBe(4);
  await next();
  await next();
  expect(task).nthReturnedWith(1, "a");
  expect(task).nthReturnedWith(2, "b");
  expect(task).nthReturnedWith(3, "c");
  expect(task).toReturnTimes(3);
  await next();
  expect(task).nthReturnedWith(4, "d");
  expect(task).toReturnTimes(4);
  expect(pool.size()).toBe(0);
  const expected = ["a", "b", "c", "d"];
  await expect(Promise.all([a, b, c, d])).resolves.toEqual(expected);
});
