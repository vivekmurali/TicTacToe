// Colyseus (barebones)
const colyseus = require("colyseus");
const room = require("./room");
const port = 2567;

const gameServer = new colyseus.Server();
gameServer.listen(port);

gameServer
  .define("battle", room)
  .on("create", (room) => console.log("room create: ", room.roomId));
