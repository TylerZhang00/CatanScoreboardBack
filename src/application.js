const fs = require("fs");
const path = require("path");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
const bodyparser = require("body-parser");

const db = require("./db");

const games = require("./routes/games");

function read(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      file,
      {
        encoding: "utf-8",
      },
      (error, data) => {
        if (error) return reject(error);
        resolve(data);
      }
    );
  });
}

module.exports = function application(
  ENV,
  actions = { updateAppointment: () => {} }
) {
  app.use(cors());

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Origin",
      "*,",
      "https://catanscoreboard.herokuapp.com/api/games"
    );
    res.header(
      "Access-Control-Allow-Origin",
      "*,",
      "https://catanscoreboard.herokuapp.com/api/games/total"
    );
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token"
    );
    next();
  });

  app.use(helmet());

  app.use(bodyparser.json());

  app.use("/api", games(db));

  if (ENV === "development" || ENV === "test") {
    Promise.all([
      read(path.resolve(__dirname, `db/schema/create.sql`)),
      read(path.resolve(__dirname, `db/schema/${ENV}.sql`)),
    ])
      .then(([create, seed]) => {
        app.get("/api/debug/reset", (request, response) => {
          db.query(create)
            .then(() => db.query(seed))
            .then(() => {
              console.log("Database Reset");
              response.status(200).send("Database Reset");
            });
        });
      })
      .catch((error) => {
        console.log(`Error setting up the reset route: ${error}`);
      });
  }

  app.close = function () {
    return db.end();
  };

  return app;
};
