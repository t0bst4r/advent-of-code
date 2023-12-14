const fs = require("fs");

function readInput(file) {
  const input = fs.readFileSync(file, "utf-8").trim();
  return parseInput(input);
}

function parseInput(input) {
  return input
    .split("\n")
    .map(row => row.split(""));
}

function tiltNorth(grid) {
  grid
    .map((_, row) => row)
    .flatMap(row => grid[row]
      .map((_, col) => grid[row][col] === "O" ? {row, col} : undefined))
    .filter(it => !!it)
    .forEach(rock => {
      while (rock.row > 0 && grid[rock.row - 1][rock.col] === ".") {
        grid[rock.row - 1][rock.col] = "O";
        grid[rock.row][rock.col] = ".";
        rock.row--;
      }
    });
}

function tiltWest(grid) {
  grid[0]
    .map((_, col) => col)
    .flatMap(col => grid
      .map((_, row) => grid[row][col] === "O" ? {row, col} : undefined))
    .filter(it => !!it)
    .forEach(rock => {
      while (rock.col > 0 && grid[rock.row][rock.col - 1] === ".") {
        grid[rock.row][rock.col - 1] = "O";
        grid[rock.row][rock.col] = ".";
        rock.col--;
      }
    });
}


function tiltSouth(grid) {
  grid
    .map((_, row) => grid.length - 1 - row)
    .flatMap(row => grid[row]
      .map((_, col) => grid[row][col] === "O" ? {row, col} : undefined))
    .filter(it => !!it)
    .forEach(rock => {
      while (rock.row < grid.length - 1 && grid[rock.row + 1][rock.col] === ".") {
        grid[rock.row + 1][rock.col] = "O";
        grid[rock.row][rock.col] = ".";
        rock.row++;
      }
    });
}

function tiltEast(grid) {
  grid[0]
    .map((_, col) => grid[0].length - 1 - col)
    .flatMap(col => grid
      .map((_, row) => grid[row][col] === "O" ? {row, col} : undefined))
    .filter(it => !!it)
    .forEach(rock => {
      while (rock.col < grid[0].length && grid[rock.row][rock.col + 1] === ".") {
        grid[rock.row][rock.col + 1] = "O";
        grid[rock.row][rock.col] = ".";
        rock.col++;
      }
    });
}

function gridToString(grid) {
  return grid.map(row => row.join("")).join("\n");
}

function getTotalLoad(grid) {
  return grid
    .map((row, rowIdx) => row.filter(it => it === "O").length * (grid.length - rowIdx))
    .reduce((a, b) => a + b);
}

function applyCycles(inputGrid, cycles) {
  const grid = inputGrid.map(row => row.map(char => char));
  const cycle = [tiltNorth, tiltWest, tiltSouth, tiltEast];
  let done = false;
  const keyOrder = [];
  const cache = new Map();

  while (!done && keyOrder.length < cycles) {
    const key = gridToString(grid);
    keyOrder.push(key);
    if (!cache.has(key)) {
      cycle.forEach(tilt => tilt(grid));
      cache.set(key, gridToString(grid));
    } else {
      done = true;
    }
  }

  if (keyOrder.length >= cycles) {
    return grid;
  }

  const cycleStart = keyOrder.indexOf(keyOrder[keyOrder.length - 1]);
  const cycleEnd = keyOrder.length;
  const cycleLength = cycleEnd - cycleStart - 1;
  const remainingCycles = 1000000000 - cycleEnd;
  const shortenedCycles = remainingCycles % cycleLength
  const resultKey = keyOrder[cycleStart + shortenedCycles];
  return parseInput(cache.get(resultKey));
}

function exec(name, file) {
  const grid01 = readInput(file);
  tiltNorth(grid01);
  const weight01 = getTotalLoad(grid01);
  console.log(`${name} 01:`, weight01);

  const grid02 = readInput(file);
  const tiltedGrid02 = applyCycles(grid02, 1000000000);
  const weight02 = getTotalLoad(tiltedGrid02);
  console.log(`${name} 02:`, weight02);
}

exec("Test", "test.txt");
console.log("---------------------");
exec("Part", "input.txt");
