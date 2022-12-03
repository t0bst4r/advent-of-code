const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8").replace(/\r\n/g, "\n");
const rucksacks = input.split("\n");

const compartments = rucksacks
  .map(content => [content.substring(0, content.length / 2), content.substring(content.length / 2, content.length)]);

const intersections = compartments
  .map(([first, second]) => first.split("").filter(char => second.includes(char)))
  .map(inter => inter.filter((item, idx, arr) => arr.indexOf(item) === idx));

const priorities = intersections
  .map(inter => inter.map(char => char.charCodeAt(0) - (char === char.toLowerCase() ? 96 : 38)));

const result = priorities
  .map(prios => prios.reduce((prev, curr) => prev + curr, 0))
  .reduce((prev, curr) => prev + curr, 0);

console.log(result);