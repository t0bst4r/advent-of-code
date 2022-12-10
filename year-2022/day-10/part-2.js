const fs = require("fs");
const path = require("path");

const commands = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8")
  .trim().replace(/\r\n/g, "\n").split("\n")
  .map(command => command.split(" "))
  .flatMap(command => command[0] === "addx" ? [["noop"], command] : [command]);

let x = 1;

let row = "";
const rows = [];
let cycle = 0;

for (let i = 0; i < commands.length; i++) {
  const [command, value] = commands[i];

  cycle++;

  if (cycle - 1 >= x - 1 && cycle - 1 <= x + 1) {
    row += "#";
  } else {
    row += ".";
  }

  if (command === "addx") {
    x += parseInt(value);
  }

  if (cycle % 40 === 0) {
    rows.push(row);
    row = "";
    cycle = 0;
  }
}

console.log(rows.join("\n"));
// RJERPEFC