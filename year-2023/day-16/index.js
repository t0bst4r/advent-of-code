const fs = require("fs");

const directions = {
  right: 0,
  down: 1,
  left: 2,
  up: 3
}

function readInput(file) {
  const input = fs.readFileSync(file, "utf-8").trim();
  return input
    .split("\n")
    .map((chars, row) => [...chars].map((char, col) => {
      return {char, row, col, visitedFrom: {}};
    }));
}

function lightBeam(grid, id, start) {
  const currentActive = [start];

  while (currentActive.length) {
    const current = currentActive.shift();
    if (current.col < 0 || current.col >= grid[0].length || current.row < 0 || current.row >= grid.length) {
      continue;
    }
    const currentGridItem = grid[current.row][current.col];
    currentGridItem.visitedFrom[id] = currentGridItem.visitedFrom[id] ?? [];
    if (!currentGridItem.visitedFrom[id].includes(current.dir)) {
      currentGridItem.visitedFrom[id].push(current.dir);
      const nextItems = getNextItems(current, grid);
      currentActive.push(...nextItems);
    }
  }
}

function getNextItems(current, grid) {
  const result = [];
  const currentGridItem = grid[current.row][current.col];
  if (currentGridItem.char === ".") {
    if (current.dir === directions.right) {
      result.push({...current, col: current.col + 1});
    } else if (current.dir === directions.left) {
      result.push({...current, col: current.col - 1});
    } else if (current.dir === directions.down) {
      result.push({...current, row: current.row + 1});
    } else if (current.dir === directions.up) {
      result.push({...current, row: current.row - 1});
    }
  } else if (currentGridItem.char === "/") {
    if (current.dir === directions.right) {
      result.push({...current, row: current.row - 1, dir: directions.up});
    } else if (current.dir === directions.left) {
      result.push({...current, row: current.row + 1, dir: directions.down});
    } else if (current.dir === directions.down) {
      result.push({...current, col: current.col - 1, dir: directions.left});
    } else if (current.dir === directions.up) {
      result.push({...current, col: current.col + 1, dir: directions.right});
    }
  } else if (currentGridItem.char === "\\") {
    if (current.dir === directions.right) {
      result.push({...current, row: current.row + 1, dir: directions.down});
    } else if (current.dir === directions.left) {
      result.push({...current, row: current.row - 1, dir: directions.up});
    } else if (current.dir === directions.down) {
      result.push({...current, col: current.col + 1, dir: directions.right});
    } else if (current.dir === directions.up) {
      result.push({...current, col: current.col - 1, dir: directions.left});
    }
  } else if (currentGridItem.char === "|") {
    if (current.dir !== directions.down) {
      result.push({...current, row: current.row - 1, dir: directions.up});
    }
    if (current.dir !== directions.up) {
      result.push({...current, row: current.row + 1, dir: directions.down});
    }
  } else if (currentGridItem.char === "-") {
    if (current.dir !== directions.left) {
      result.push({...current, col: current.col + 1, dir: directions.right});
    }
    if (current.dir !== directions.right) {
      result.push({...current, col: current.col - 1, dir: directions.left});
    }
  }
  return result;
}

function exec(name, file) {
  const grid = readInput(file);

  const runIds = [];

  for (let i = 0; i < grid.length; i++) {
    lightBeam(grid, `Row ${i}, Col 0, Right`, {col: 0, row: i, dir: directions.right});
    lightBeam(grid, `Row ${i}, Col ${grid[0].length - 1}, Left`, {
      col: grid[0].length - 1,
      row: i,
      dir: directions.left
    });
    runIds.push(`Row ${i}, Col 0, Right`, `Row ${i}, Col ${grid[0].length - 1}, Left`);
  }

  for (let i = 0; i < grid[0].length; i++) {
    lightBeam(grid, `Row 0, Col ${i}, Down`, {col: i, row: 0, dir: directions.down});
    lightBeam(grid, `Row ${grid.length - 1}, Col ${i}, Up`, {
      col: i,
      row: grid.length - 1,
      dir: directions.up
    });
    runIds.push(`Row 0, Col ${i}, Down`, `Row ${grid.length - 1}, Col ${i}, Up`);
  }

  const result01 = grid.flat().filter(it => (it.visitedFrom["Row 0, Col 0, Right"]?.length ?? 0) > 0).length;
  console.log(`${name} 01:`, result01);

  const result02 = runIds.map(runId => {
    return {
      runId,
      count: grid.flat().filter(it => (it.visitedFrom[runId]?.length ?? 0) > 0).length
    };
  }).reduce((a, b) => a.count < b.count ? b : a);

  console.log(`${name} 02:`, result02.count, result02.runId);
}

exec("Test", "test.txt");
console.log("------------------------------------")
exec("Part", "input.txt");
