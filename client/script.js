import Phaser from "phaser";
import "regenerator-runtime/runtime";
import * as Colyseus from "colyseus.js";
// ...
// let client = new Colyseus.Client("ws://localhost:2567");

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  backgroundColor: "#ffffff",
  scene: {
    preload: preload,
    create: create,
  },
};

let game = new Phaser.Game(config);

function preload() {
  this.load.image("board", "assets/board.png");
  this.load.image("x", "assets/X.png");
  this.load.image("o", "assets/O.png");
}

const client = new Colyseus.Client("ws://localhost:2567");

const connect = async () => {
  const room = await client.joinOrCreate("battle");
  // console.log(room);
  return room;
};

async function create() {
  // console.log(game);
  //Get width and height of the object
  let { width, height } = this.sys.game.canvas;

  const room = await connect();
  // console.log(room);

  // this.add.image(400, 400, "board");

  // Setting up grid
  let grid = this.add
    .grid(
      width / 2,
      height / 2,
      width,
      height,
      width / 3,
      height / 3,
      0x000000,
      255,
      0x000000
    )
    .setInteractive();

  var points = [
    { x: width / 6, y: height / 6 },
    { x: width / 2, y: height / 6 },
    { x: (5 * width) / 6, y: height / 6 },
    { x: width / 6, y: height / 2 },
    { x: width / 2, y: height / 2 },
    { x: (5 * width) / 6, y: height / 2 },
    { x: width / 6, y: (5 * height) / 6 },
    { x: width / 2, y: (5 * height) / 6 },
    { x: (5 * width) / 6, y: (5 * height) / 6 },
  ];
  //   grid event listener
  grid.on("pointerdown", function (pointer) {
    //Find the closes point
    let x = findClosest(xpoints, pointer.position.x);
    let y = findClosest(ypoints, pointer.position.y);
    //Point to send to server
    let point = points.findIndex((point) => point.x === x && point.y === y);
    // console.log(point);
    room.send("action", point);
  });

  let xpoints = [width / 6, width / 2, (5 * width) / 6];
  let ypoints = [height / 6, height / 2, (5 * height) / 6];

  room.onMessage("action", (message) => {
    // console.log(message);
    message.forEach((a, i) => {
      // console.log(a);
      if (a == "x") {
        this.add.image(points[i].x, points[i].y, "x");
      } else if (a == "o") {
        this.add.image(points[i].x, points[i].y, "o");
      }
    });
  });
  //   find closest point
  const findClosest = (arr, num) => {
    if (arr == null) {
      return;
    }

    return arr.reduce((prev, current) =>
      Math.abs(current - num) < Math.abs(prev - num) ? current : prev
    );
  };
}

// client
//   .joinOrCreate("battle")
//   .then((room) => {
//     // console.log("joined successfully", room);
//     // room.send("action", "Test 123 123 test");
//     return room;
//   })
//   .catch((e) => {
//     console.error("join error", e);
//   });
