const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const router = require("./routes/allRoutes");

const server = express();

server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

server.use(router);

server.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send("Something went wrong!");
  });

module.exports = server;
