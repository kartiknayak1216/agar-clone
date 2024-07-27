const express = require("express");
const http = require("http");
const socketio = require("socket.io");

// Create an Express application
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Initialize socket.io with CORS options
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

// Serve static files from the "public" directory
app.use(express.static(__dirname + "/public"));

// Start the server
server.listen(8000, () => {
  console.log(`Server started at port ${8000}`);
});

// Export the app and io for use in other modules
module.exports = {
  app,
  io,
};
