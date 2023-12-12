const fs = require("fs");
const exp = require("constants");

function readInput(file) {
  const grid = fs.readFileSync(file, "utf-8")
    .trim().split("\n")
    .map(it => it.trim().split(""))
    .map(row => row.map(it => ({char: it})));
  const galaxies = grid.flat().filter(it => it.char === "#")
  return {grid, galaxies};
}

function calculateDistance(grid, from, to, factor) {
  const emptyRows = grid.filter((row, rowIdx) => rowIdx > Math.min(from.currentY, to.currentY)
    && rowIdx < Math.max(from.currentY, to.currentY)
    && row.every(it => it.char === ".")).length;
  const emptyColumns = grid[0].filter((_, colIdx) => colIdx > Math.min(from.currentX, to.currentX)
    && colIdx < Math.max(from.currentX, to.currentX)
    && grid.every(it => it[colIdx].char === ".")).length;
  return Math.abs(to.currentY - from.currentY) + Math.abs(to.currentX - from.currentX)
    - emptyRows + emptyRows * factor
    - emptyColumns + emptyColumns * factor;
}

function calculateDistances(grid, galaxies, factor) {
  galaxies.forEach((galaxy, idx) => {
    galaxy.currentY = grid.findIndex(row => row.includes(galaxy));
    galaxy.currentX = grid[galaxy.currentY].indexOf(galaxy);
    galaxy.id = idx + 1;
  });
  const pairs = galaxies
    .flatMap((from, idx) => galaxies
      .slice(idx + 1, galaxies.length)
      .map(to => [from, to]));
  return pairs.map(([from, to]) => ({from, to, distance: calculateDistance(grid, from, to, factor)}));
}

function exec(name, file, debug) {
  const {grid, galaxies} = readInput(file);
  const distances01 = calculateDistances(grid, galaxies, 2);
  if (debug) {
    console.log(name, distances01.map(it => `${it.from.id} (${it.from.currentX}, ${it.from.currentY}) -> ${it.to.id} (${it.to.currentX}, ${it.to.currentY}) = ${it.distance}`));
  }
  const result01 = distances01.reduce((a, b) => a + b.distance, 0);
  console.log(`${name} 01:`, result01);

  const distances02 = calculateDistances(grid, galaxies, 1000000);
  if (debug) {
    console.log(name, distances02.map(it => `${it.from.id} (${it.from.currentX}, ${it.from.currentY}) -> ${it.to.id} (${it.to.currentX}, ${it.to.currentY}) = ${it.distance}`));
  }
  const result02 = distances02.reduce((a, b) => a + b.distance, 0);
  console.log(`${name} 02:`, result02);
}

exec("Test", "test.txt");
console.log("------------------------");
exec("Part", "input.txt");
