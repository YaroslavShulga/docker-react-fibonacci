const redis = require("redis");
const keys = require("./keys");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 10000
});

const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on("message", (channel, msg) => {
  redisClient.hset("values", msg, fib(parseInt(msg)));
});

sub.subscribe("insert");

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
