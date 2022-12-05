const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8").replace(/\r\n/, "\n");
const games = input.split("\n").filter(it => it.length);

const winOrder = ["A", "B", "C"];

const rotate = (list, currIdx, direction) => {
  let next = currIdx + direction;
  if (next === -1) next = list.length - 1;
  else if (next === list.length) next = 0;
  return next;
}

const commandMap = {
  X: (other) => winOrder[rotate(winOrder, winOrder.indexOf(other), -1)],
  Y: (other) => other,
  Z: (other) => winOrder[rotate(winOrder, winOrder.indexOf(other), +1)]
};

const scoreMap = {A: 1, B: 2, C: 3};
const commandScoreMap = {X: 0, Y: 3, Z: 6};

const scores = games
  .map(game => game.split(" "))
  .map(([other, command]) => [other, command, commandMap[command](other)])
  .map(([, command, me]) => commandScoreMap[command] + scoreMap[me])

const totalScore = scores.reduce((prev, curr) => prev + curr, 0);
console.log(totalScore);
