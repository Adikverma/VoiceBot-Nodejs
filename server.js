//imports
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

//socket.io
const socket = require("socket.io");

//including the socketSetup file
const socketSetup = require("./src/socketSetup");

const port = process.env.PORT || 3000;

//initialising the express server
const app = express();

//to distribute static files
app.use(express.static("client"));

//better logs, using the dev version
app.use(morgan("dev"));

setupServer = function () {
  app.use(cors());

  //responding to http get method to send the html file to client
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "\\client\\index.html"));
  });

  //mounting server on port
  const server = app.listen(port, () => {
    console.log("Running server on port %s", port);
  });

  //instance of socket on server
  io = socket(server);

  socketSetup.socketSetup();
};

setupServer();
