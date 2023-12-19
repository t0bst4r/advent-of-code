const fs = require("fs");

function parseDirection(direction) {
  switch (direction) {
    case "R":
    case "0":
      return [1, 0];
    case "D":
    case "1":
      return [0, 1];
    case "L":
    case "2":
      return [-1, 0];
    case "U":
    case "3":
      return [0, -1];
  }
}

function readInput(file) {
  const commandRegex = /^(\w+)\s+(\d+)\s+\(#(.*)\)$/;
  const input = fs.readFileSync(file, "utf-8").trim().split("\n");
  return input
    .map(row => commandRegex.exec(row))
    .filter(it => !!it)
    .map(([, direction, length, color]) => ({direction, length: Number(length), color}));
}

function solve(vectors) {
  let result = 1;
  let currentX = 0;
  for (const {direction, length} of vectors) {
    const [x, y] = parseDirection(direction);
    currentX += x * length;
    result += y * length * currentX + length / 2;
  }
  return result;
}

function exec(name, file) {
  const inputCommands = readInput(file);
  const result01 = solve(inputCommands);
  console.log(`${name} 01:`, result01);

  const commands02 = inputCommands.map(it => ({
    direction: it.color[5],
    length: parseInt(it.color.substring(0, 5), 16)
  }));
  const result02 = solve(commands02);
  console.log(`${name} 02:`, result02);
}

exec("Test", "test.txt");
console.log("----------------------------");
exec("Part", "input.txt");
