const fs = require("fs");
const {dijkstra} = require("../../algorithms/pathfinding/dijkstra");

function readInput(file) {
  const input = fs.readFileSync(file, "utf-8").trim();
  return input
    .split("\n")
    .map((chars, y) => chars.split("")
      .map((char, x) => ({x, y, char})));
}

const toKey = (n) => `${n.x},${n.y},${n.currentSteps}`;
const fromKey = (key) => {
  const [x, y, currentSteps] = key.split(",").map(Number);
  return {x, y, currentSteps};
}

function getNeighbors01(grid, nodeKey, stepLimit) {
  const node = fromKey(nodeKey);
  if (node.currentSteps >= stepLimit) {
    return [];
  }

  return [[1, 0], [0, 1], [-1, 0], [0, -1]]
    .map(([dx, dy]) => [node.x + dx, node.y + dy])
    .filter(([x, y]) => x >= 0 && y >= 0 && y < grid.length && x < grid[0].length)
    .filter(([x, y]) => grid[y][x].char !== "#")
    .map(([x, y]) => ({x, y, currentSteps: node.currentSteps + 1}))
    .map(toKey);
}

function getNeighbors02(grid, nodeKey, stepLimit) {
  const node = fromKey(nodeKey);
  if (node.currentSteps >= stepLimit) {
    return [];
  }

  return [[1, 0], [0, 1], [-1, 0], [0, -1]]
    .map(([dx, dy]) => [node.x + dx, node.y + dy])
    .filter(([x, y]) => {
      const adjustedX = ((x % grid[0].length) + grid[0].length) % grid[0].length;
      const adjustedY = ((y % grid.length) + grid.length) % grid.length;
      return grid[adjustedY][adjustedX].char !== "#";
    })
    .map(([x, y]) => ({x, y, currentSteps: node.currentSteps + 1}))
    .map(toKey);
}


function getResult(distances, maxSteps) {
  return Array.from(distances.keys())
    .map(nodeKeys => fromKey(nodeKeys))
    .filter(it => it.currentSteps === maxSteps)
    .map(it => `${it.x},${it.y}`)
    .filter((item, idx, arr) => arr.indexOf(item) === idx)
    .length;
}

function exec(name, file, maxSteps01, maxSteps02) {
  const grid = readInput(file);
  const startNode = grid.flat().find(it => it.char === "S");

  const getGridNeighbors01 = (node) => getNeighbors01(grid, node, maxSteps01);
  const {distances: distances01} = dijkstra([toKey({...startNode, currentSteps: 0})], getGridNeighbors01);
  const result01 = getResult(distances01, maxSteps01);
  console.log(`${name} 01:`, result01);

  console.log(`${name} 02:`, undefined);
}

exec("Test", "test.txt", 6, 5000);
exec("Part", "input.txt", 64, 26501365);
