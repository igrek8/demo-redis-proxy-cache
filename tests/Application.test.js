const server = require("../services/server");
const redis = require("../services/redis");
const lru = require("../services/lru");

const rand = () => Math.random().toString(36).substr(2);

const proxy = (key) => server.inject({ method: "GET", url: `/${key}` });

test("when not in cache and not in redis", async () => {
  const key = "not-found";
  const statusCode = 404;
  const lruRead = jest.spyOn(lru, "read").mockReturnValue(null);
  const lruWrite = jest.spyOn(lru, "write");
  const redisGet = jest.spyOn(redis, "get");
  await expect(redis.del(key)).resolves.toEqual(expect.any(Number));
  await expect(proxy(key)).resolves.toMatchObject({ statusCode });
  // ensure LRU is read for no entry
  expect(lruRead).toHaveBeenCalled();
  // ensure Redis is read for no entry
  expect(redisGet).toHaveBeenCalled();
});

test("when not in cache but in redis", async () => {
  const key = "found";
  const payload = "found";
  const statusCode = 200;
  const lruRead = jest.spyOn(lru, "read").mockReturnValue(null);
  const lruWrite = jest.spyOn(lru, "write");
  const redisGet = jest.spyOn(redis, "get");
  await expect(redis.set(key, payload)).resolves.toBe("OK");
  await expect(proxy(key)).resolves.toMatchObject({ statusCode, payload });
  // ensure LRU is checked for no entry
  expect(lruRead).toHaveBeenCalled();
  // ensure Redis is called and returns the value
  expect(redisGet).toHaveBeenCalled();
  // ensure LRU persists the value
  expect(lruWrite).toHaveBeenCalledWith(key, payload);
});

test("when in cache but not in redis", async () => {
  const key = "found";
  const payload = "found";
  const statusCode = 200;
  const lruRead = jest.spyOn(lru, "read").mockReturnValue(payload);
  const redisGet = jest.spyOn(redis, "get");
  await expect(proxy(key)).resolves.toMatchObject({ statusCode, payload });
  // ensure LRU is read
  expect(lruRead).toHaveBeenCalled();
  // ensure Redis is not called
  expect(redisGet).not.toHaveBeenCalledWith(payload);
});

test("when not in cache but in redis", async () => {
  const key = "found";
  const payload = "found";
  const statusCode = 200;
  const lruWrite = jest.spyOn(lru, "write");
  const lruRead = jest.spyOn(lru, "read").mockReturnValue(null);
  const redisGet = jest.spyOn(redis, "get");
  await expect(redis.set(key, payload)).resolves.toBe("OK");
  await expect(proxy(key)).resolves.toMatchObject({ statusCode, payload });
  // ensure LRU is read
  expect(lruRead).toHaveBeenCalled();
  // ensure Redis is called
  expect(redisGet).toHaveBeenCalledWith(key);
  // ensure Redis returns the value
  expect(redisGet.mock.calls).toEqual([[payload]]);
  // ensure LRU persists the value
  expect(lruWrite).toHaveBeenCalledWith(key, payload);
});
