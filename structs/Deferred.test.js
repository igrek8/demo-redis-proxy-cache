const Deferred = require("./Deferred");

const next = () => new Promise((r) => setImmediate(r));

test("Deferred pending", async () => {
  const mut = new Deferred();
  const fn = jest.fn();
  mut.promise.then(fn);
  await next();
  expect(fn).not.toBeCalled();
});

test("Deferred resolve", async () => {
  const mut = new Deferred();
  const fn = jest.fn();
  mut.promise.then(fn);
  mut.resolve();
  await next();
  expect(fn).toBeCalled();
});

test("Deferred reject", async () => {
  const mut = new Deferred();
  const fn = jest.fn();
  mut.promise.catch(fn);
  mut.reject();
  await next();
  expect(fn).toBeCalled();
});
