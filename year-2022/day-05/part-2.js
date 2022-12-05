const fs = require("fs");
const path = require("path");

function chunk(list, size) {
  const result = [];
  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size));
  }
  return result;
}

const inputStack = fs.readFileSync(path.join(__dirname, "input-stack.txt"), "utf-8").replace(/\r\n/g, "\n");
const inputMoves = fs.readFileSync(path.join(__dirname, "input-moves.txt"), "utf-8").replace(/\r\n/g, "\n");

const rows = inputStack.split("\n")
  .map(line => chunk([...line], 4))
  .map(chunks => chunks.map(chunk => chunk[1]).map(char => char === " " ? undefined : char));

const columns = rows.reduce((prev, curr) => {
  curr.forEach((char, idx) => {
    prev[idx] = prev[idx] ?? [];
    if (curr[idx] !== undefined) {
      prev[idx].unshift(curr[idx]);
    }
  });
  return prev;
}, []);

const commandRegex = /move (\d+) from (\d+) to (\d+)/;
const commands = inputMoves.split("\n").filter(it => it.length)
  .map(command => commandRegex.exec(command))
  .map(([, count, from, to]) => [count, from, to].map(n => parseInt(n)));

commands.forEach(([count, from, to]) => {
    columns[to - 1].push(...columns[from - 1].splice(columns[from - 1].length - count, count));
});

console.log(columns.map(column => column[column.length - 1]).join(""));