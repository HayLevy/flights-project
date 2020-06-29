const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

//const server = http.createServer(app);
var server = app.listen(3000);
server.on("error", onError);
server.on("listening", onListening);
//server.listen(port);
var io = require('socket.io').listen(server);
sockets = new Set();

/**
 *	Handle connnection Websockets
 */

io.on('connection', socket => {

  sockets.add(socket);
  console.log(`Socket ${socket.id} added`);

  socket.on('message', data => {
    for (const s of sockets) {
      console.log(`Emitting value: ${loggedUsers}`);
      s.emit('message', { data: loggedUsers });
    }

  });

  socket.on('disconnect', () => {
    console.log(`Deleting socket: ${socket.id}`);
    sockets.delete(socket);
    for (const s of sockets) {
      console.log(`Emitting value: ${loggedUsers}`);
      s.emit('message', { data: loggedUsers });
    }
    console.log(`Remaining sockets: ${sockets.size}`);
  });

  socket.on('timeout', data => {
    console.log("Entered timeout!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    for (const s of sockets) {
      console.log(`Emitting value: ${loggedUsers}`);
      s.emit('message', { data: loggedUsers });
    }

  });

});