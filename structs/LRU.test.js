const LRU = require("./LRU");

jest.useFakeTimers();

const keys = (obj) => [...obj].map((node) => node.key);

test("LRU respects size", () => {
  const lru = new LRU({ capacity: 3, ttl: 60000 });
  lru.write("a", 1);
  lru.write("b", 2);
  lru.write("c", 3);
  expect(keys(lru)).toEqual(["c", "b", "a"]);
  lru.write("d", 4);
  expect(keys(lru)).toEqual(["d", "c", "b"]);
});

test("LRU expires entries", () => {
  const lru = new LRU({ capacity: 3, ttl: 60000 });
  lru.write("a", 1);
  lru.write("b", 2);
  lru.write("c", 3);
  expect(keys(lru)).toEqual(["c", "b", "a"]);
  jest.advanceTimersByTime(60000);
  expect(keys(lru)).toEqual([]);
});

test("LRU renews ttl for recently touched", () => {
  const lru = new LRU({ capacity: 3, ttl: 60000 });
  lru.write("a", 1);
  lru.write("b", 2);
  lru.write("c", 3);
  expect(keys(lru)).toEqual(["c", "b", "a"]);
  jest.advanceTimersByTime(30000);
  // read from the cache and reset ttl
  lru.read("a");
  // place 'a' in front since it has beeen read recently
  expect(keys(lru)).toEqual(["a", "c", "b"]);
  jest.advanceTimersByTime(30000);
  // expire untouched keys
  expect(keys(lru)).toEqual(["a"]);
});
