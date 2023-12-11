const fs = require("fs");

function readInput(file) {
  const input = fs.readFileSync(file, "utf-8").trim();
  const grid = input.split("\n").map((it, row) => [...it].map((char, col) => ({char, row, col})));
  const width = grid[0].length;
  const startingChar = grid.map(it => it.map(i => i.char).join("")).join("").indexOf("S");
  const start = grid[Math.floor(startingChar / width)][startingChar % width];
  start.distance = 0;
  return {grid, start};
}

function scaleGrid(grid) {
  const scales = {
    "L": ".#..##...",
    "F": "....##.#.",
    "J": ".#.##....",
    "7": "...##..#.",
    "-": "...###...",
    "|": ".#..#..#.",
    ".": ".........",
    "S": ".#.###.#.",
  }
  return grid
    .flatMap(row => [
      row.flatMap(node => [...scales[node.char].substring(0, 3)]),
      row.flatMap(node => [...scales[node.char].substring(3, 6)]),
      row.flatMap(node => [...scales[node.char].substring(6)]),
    ])
    .map((row, rowId) => row.map((char, colId) => ({char, row: rowId, col: colId})));
}

function findPath(grid, startRow, startCol) {
  const start = grid[startRow][startCol];
  const path = [start];

  while (true) {
    const current = path[path.length - 1];
    const nextPathDir = current.nextPathDir ?? 0;
    current.nextPathDir = nextPathDir + 1;
    let next = undefined;
    if (nextPathDir === 0) {
      if (current.row > 0) {
        next = grid[current.row - 1][current.col];
      } else {
        next = null;
      }
    } else if (nextPathDir === 1) {
      if (current.row < grid.length - 1) {
        next = grid[current.row + 1][current.col];
      } else {
        next = null;
      }
    } else if (nextPathDir === 2) {
      if (current.col > 0) {
        next = grid[current.row][current.col - 1];
      } else {
        next = null;
      }
    } else if (nextPathDir === 3) {
      if (current.col < grid[0].length - 1) {
        next = grid[current.row][current.col + 1];
      } else {
        next = null;
      }
    }
    if (next && next.char === '.') {
      next = null;
    }

    if (next === undefined) {
      current.nextPathDir = undefined;
      path.pop();
    } else if (path.length > 2 && next === start) {
      path.push(next);
      break;
    } else if (next && !path.includes(next)) {
      path.push(next);
    }
  }

  path.forEach((it, idx) => {
    it.distance = Math.min(idx, path.length - idx);
  });
  return path;
}

function removeEveryPartNotInPath(grid, path) {
  grid.flat()
    .filter(it => !path.includes(it))
    .forEach(it => it.char = ".");
}

function markInOut(grid) {
  const outNodes = [
    ...grid[0],
    ...grid[grid.length - 1],
    ...grid.map(it => it[0]),
    ...grid.map(it => it[it.length - 1]),
  ].filter(it => it.char === ".");
  while (outNodes.length > 0) {
    const current = outNodes.shift();
    current.inOrOut = "O";
    const next = [
      current.row > 0 ? grid[current.row - 1][current.col] : undefined,
      current.col > 0 ? grid[current.row][current.col - 1] : undefined,
      current.row < grid.length - 1 ? grid[current.row + 1][current.col] : undefined,
      current.col < grid[0].length - 1 ? grid[current.row][current.col + 1] : undefined,
    ].filter(it => !!it && it.char === "." && it.inOrOut === undefined && !outNodes.includes(it));
    outNodes.push(...next);
  }

  grid.flat()
    .filter(it => it.char === "." && it.inOrOut === undefined)
    .forEach(it => it.inOrOut = "I");
}

function exec(name, file, debug) {
  const {grid, start} = readInput(file);
  const scaledGrid = scaleGrid(grid);
  const path = findPath(scaledGrid, start.row * 3 + 1, start.col * 3 + 1);
  if (debug) {
    console.log(scaledGrid.map((row) => row.map((it) => it.distance != null ? "*" : it.char).join("")).join("\n"));
  }
  const result01 = path.map(it => it.distance).sort((a, b) => b - a)[0] / 3;
  console.log(`${name} 01:`, result01);

  removeEveryPartNotInPath(scaledGrid, path);
  markInOut(scaledGrid);

  if (debug) {
    console.log(scaledGrid.map((row) => row.map((it) => it.inOrOut ?? it.char).join("")
    ).join("\n"));
  }

  const result02 = grid.flat()
    .filter(node => scaledGrid[node.row * 3 + 1][node.col * 3 + 1].inOrOut === "I")
    .length;

  if (debug) {
    console.log(grid.map((row) => row.map((node) => scaledGrid[node.row * 3 + 1][node.col * 3 + 1].inOrOut ?? node.char).join("")).join("\n"));
  }

  console.log(`${name} 02:`, result02);
}

exec("Test I", "test-01.txt");
console.log("------------------------")
exec("Test II", "test-02.txt");
console.log("------------------------")
exec("Test III", "test-03.txt");
console.log("------------------------")
exec("Part", "input.txt");
