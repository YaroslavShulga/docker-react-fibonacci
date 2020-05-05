const redis = require("redis");
const express = require("express");
const {Pool} = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");

const keys = require("./keys");

// ---- EXPRESS ---------------------
const app = express();

app.use(cors());
app.use(bodyParser.json());

// --- PG -------------
const pgClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDb,
  user: keys.pgUser,
  password: keys.pgPassword
});
pgClient.on('connect', () => console.log("Connection to pg is success!"));
pgClient.on("error", () => {
  console.log("Connection pg is lost!");
  process.exit(-1);
});

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch(err => console.error(err));

// ---- REDIS -------------------
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 10000
});
redisClient.on("connect", () => console.log('Redis connection success!'));
redisClient.on("error", (err) => console.log(err));

const redisPublisher = redisClient.duplicate();

// ---- APP --------------------
app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM values");

  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (index > 40) {
    return res.status(422).send("Index to hight");
  }

  redisClient.hset("values", index, "Nothing yet");
  redisPublisher.publish("insert", index);

  await pgClient.query(`INSERT INTO values (number) VALUES ($1)`, [index]);

  return res.send({working: true});
});

app.listen(5000, () => console.log("Server is run"));
