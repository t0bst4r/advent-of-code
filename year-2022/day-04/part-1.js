const path = require("path");
const fs = require("fs");

function fullyIncludes(a, b) {
  return (a[0] <= b[0] && a[1] >= b[1])
    || (b[0] <= a[0] && b[1] >= a[1]);
}

const lines = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8")
  .replace(/\r\n/g, "\n")
  .split("\n");

const fullyIncludedGroups = lines
  .filter(it => it.length)
  .map(line => line.split(","))
  .map(([a, b]) => [a.split("-"), b.split("-")])
  .map(tuples => tuples.map(tuple => tuple.map(num => parseInt(num))))
  .filter(([a, b]) => fullyIncludes(a, b));

console.log(fullyIncludedGroups.length);
console.log(`Memory Heap: ${process.memoryUsage().heapUsed / 1024} KB`);
