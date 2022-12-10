const fs = require("fs");
const path = require("path");

const commands = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8").replace(/\r\n/g, "\n").trim().split("\n");

function moveTail(head, tail) {
  let [x, y] = tail;
  const dx = head[0] - x;
  const dy = head[1] - y;
  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
    x += dx === 0 ? 0 : (dx < 0 ? -1 : 1);
    y += dy === 0 ? 0 : (dy < 0 ? -1 : 1);
  }

  return [x, y];
}

function moveHead(head, dir) {
  let [x, y] = head;
  if (dir === "U") {
    y--;
  } else if (dir === "D") {
    y++;
  } else if (dir === "L") {
    x--;
  } else {
    x++;
  }
  return [x, y];
}

let [head, tail] = [[0, 0], [0, 0]];
const visited = {"0x0": true};

for (let i = 0; i < commands.length; i++) {
  const command = commands[i];
  const dir = command.charAt(0);
  const num = parseInt(command.substring(2));
  for (let j = 0; j < num; j++) {
    head = moveHead(head, dir);
    tail = moveTail(head, tail);
    visited[tail[0] + "x" + tail[1]] = true;
  }
}

console.log(Object.keys((visited)).length)