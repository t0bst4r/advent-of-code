const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8").replace(/\r\n/, "\n");
const games = input.split("\n").filter(it => it.length);

const inOutMap = {X: "A", Y: "B", Z: "C"};
const winMap = {A: "C", B: "A", C: "B"};
const scoreMap = {A: 1, B: 2, C: 3};
const gameResult = (other, me) => other === me ? 3 : (winMap[other] === me ? 0 : 6);

const scores = games
  .map(game => game.split(" "))
  .map(([other, me]) => [other, inOutMap[me]])
  .map(([other, me]) => gameResult(other, me) + scoreMap[me]);

const totalScore = scores.reduce((prev, curr) => prev + curr, 0);
console.log(totalScore);