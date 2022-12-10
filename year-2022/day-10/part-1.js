const fs = require("fs");
const path = require("path");

const commands = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8")
  .trim().replace(/\r\n/g, "\n").split("\n")
  .map(command => command.split(" "))
  .flatMap(command => command[0] === "addx" ? [["noop"], command] : [command]);

let x = 1;

const signals = [];
let cycle = 0;

for (let i = 0; i < commands.length; i++) {
  const [command, value] = commands[i];
  cycle++;
  if ((cycle - 20) % 40 === 0) {
    signals.push(cycle * x);
  }
  if (command === "addx") {
    const num = parseInt(value);
    x += num;
  }
}

console.log(signals.reduce((p, c) => p + c));