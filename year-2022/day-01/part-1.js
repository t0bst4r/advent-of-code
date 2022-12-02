const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

const elves = content.replace(/\r\n/g, "\n").split(/\n\n/);

console.log(`${elves.length} elves`);

const ratioPerElf = elves
  .map(elf => elf.split("\n").reduce((prev, curr) => prev + parseInt(curr), 0))
  .sort((a, b) => b - a);

console.log(ratioPerElf[0]);
