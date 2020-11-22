const colyseus = require("colyseus");

const schema = require("@colyseus/schema");
const Schema = schema.Schema;
class State extends Schema {}

schema.defineTypes(State, {
  currentTurn: "string",
  player1: "string",
  player2: "string",
  winner: "string",
  draw: "boolean",
});

module.exports = class room extends colyseus.Room {
  //   maxClients = 2;
  // When room is initialized
  onCreate(options) {
    // console.log("created room");
    this.boardState = ["", "", "", "", "", "", "", "", ""];
    this.setState(new State());
    this.onMessage("action", (client, message) => {
      //   this.playerAction(client, message)
      //   console.log(client.id, message);
      client.id === this.state.player1
        ? this.board(message, "x")
        : this.board(message, "o");
      //   console.log(this.boardState);
      this.broadcast("action", this.boardState);
    });
  }

  board(pos, choice) {
    this.boardState[pos] = choice;
    if (this.checkWin(this.boardState, choice)) console.log("Winner");
  }

  checkWin(board, side) {
    var winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2],
    ];

    for (var i = 0; i < winConditions.length; i++) {
      var sum = 0;
      var w = winConditions[i];

      for (var b = 0; b < w.length; b++) {
        // console.log(b, board[w[b]]);
        if (board[w[b]] === side) {
          sum++;
        }
        // console.log("sum: ", sum);
      }
      if (sum === 3) {
        return true;
      }
    }
    return false;
  }
  // When client successfully join the room
  onJoin(client, options) {
    // console.log("joined room: ", client);
    if (!this.state.player1) this.state.player1 = client.id;
    else this.state.player2 = client.id;
    this.state.currentTurn = this.state.player1;
  }

  // When a client leaves the room
  onLeave(client, consented) {
    // console.log("left room: ", client);
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
};
