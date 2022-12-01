const fs = require("fs");

const content = fs.readFileSync("input.txt", "utf8");

const elves = content.replace(/\r\n/g, "\n").split(/\n\n/);

console.log(`${elves.length} elves`);

const ratioPerElf = elves
  .map(elf => elf.split("\n").reduce((prev, curr) => prev + parseInt(curr), 0))
  .sort((a, b) => b - a);

console.log("Highest: " + ratioPerElf[0])
console.log("Top three: " + (ratioPerElf[0] + ratioPerElf[1] + ratioPerElf[2]))
