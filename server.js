const express = require("express");
const socketio = require("socket.io");

const app = express();
app.use(express.static(__dirname + "/public"));
const server = app.listen(8000, () => {
  console.log(`Server started at port${8000}`);
});

const io = socketio(server);

module.exports = {
  app,
  io,
};
