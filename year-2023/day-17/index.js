const fs = require("fs");
const {dijkstra} = require("../../algorithms/pathfinding/dijkstra");

const last = (arr) => arr[arr.length - 1];

function readInput(file) {
  return fs.readFileSync(file, "utf-8").trim()
    .split("\n")
    .map((chars, y) => chars.split("")
      .map(char => Number(char))
      .map((heatLoss, x) => ({x, y, heatLoss})));
}

function getNodeInfo(nodeKey, grid) {
  const [x, y, dir, dirCount] = nodeKey.split(",").map(Number);
  return {x, y, dir, dirCount, heatLoss: grid[y][x].heatLoss};
}

const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function generateNeighbors(nodeKey, grid, minimum, maximum) {
  const {x, y, dir, dirCount} = getNodeInfo(nodeKey, grid);
  const next = [];
  if (dirCount < maximum) {
    next.push([...dirs[dir], dir, dirCount + 1]);
  }
  if (dirCount >= minimum) {
    next.push([...dirs[(dir + 1) % 4], (dir + 1) % 4, 1]);
    next.push([...dirs[(dir + 3) % 4], (dir + 3) % 4, 1]);
  }
  return next
    .map(([dx, dy, nextDir, nextDirCount]) => [x + dx, y + dy, nextDir, nextDirCount])
    .filter(([nextX, nextY]) => nextX >= 0 && nextY >= 0 && nextX < grid[0].length && nextY < grid.length)
    .map(([nextX, nextY, nextDir, nextDirCount]) => `${nextX},${nextY},${nextDir},${nextDirCount}`);
}

function findShortestAllowedDistance(distances, endNode, minimum) {
  return Array.from(distances.keys()).filter(it => it.startsWith(`${endNode.x},${endNode.y},`))
    .filter(key => {
      const [, , , dirCount] = key.split(",").map(Number);
      return dirCount >= minimum;
    })
    .map(it => distances.get(it))
    .sort((a, b) => a - b)
    [0];
}

function solve(grid, minimum, maximum) {
  const startNode = grid[0][0];
  const endNode = last(last(grid));

  const startNodes = [`${startNode.x},${startNode.y},0,1`, `${startNode.x},${startNode.y},1,1`];
  const getWeight = node => getNodeInfo(node, grid).heatLoss;
  const getNeighbors = node => generateNeighbors(node, grid, minimum, maximum)
  const {distances} = dijkstra(startNodes, getWeight, getNeighbors);
  return findShortestAllowedDistance(distances, endNode, minimum);
}

function exec(name, file) {
  const grid = readInput(file);
  const result01 = solve(grid, 1, 3);
  console.log(`${name} 01:`, result01);
  const result02 = solve(grid, 4, 10);
  console.log(`${name} 02:`, result02);
}

exec("Test", "test.txt");
console.log("--------------------------");
exec("Part", "input.txt");
