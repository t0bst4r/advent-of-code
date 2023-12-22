const fs = require("fs");
const {before} = require("node:test");

function readInput(file) {
  const brickPattern = /^(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)$/;
  const input = fs.readFileSync(file, "utf-8").trim();
  return input.split("\n")
    .map(chars => brickPattern.exec(chars))
    .map(([, ...args]) => args.map(Number))
    .map(([x1, y1, z1, x2, y2, z2], idx) => {
      const bottom = Math.min(z1, z2);
      const top = Math.max(z1, z2);
      const left = Math.min(x1, x2);
      const right = Math.max(x1, x2);
      const front = Math.min(y1, y2);
      const back = Math.max(y1, y2);
      return {top, bottom, left, right, front, back, id: idx + 1};
    })
    .reduce((map, brick) => {
      map.set(brick.id, brick);
      return map;
    }, new Map());
}

function collides(brickA, brickB) {
  return ![
    [brickA.bottom, brickB.top],
    [brickB.bottom, brickA.top],
    [brickA.left, brickB.right],
    [brickB.left, brickA.right],
    [brickA.front, brickB.back],
    [brickB.front, brickA.back],
  ].some(([a, b]) => a > b);
}

function settleBricks(bricks) {
  const floor = {top: 0, bottom: 0, left: -Infinity, right: Infinity, front: -Infinity, back: Infinity};
  const settledBricks = [];
  const queue = Array.from(bricks.values());
  while (queue.length > 0) {
    const current = queue.sort((a, b) => a.bottom - b.bottom).shift();
    const settledCurrent = {...current, top: current.top - 1, bottom: current.bottom - 1};
    const supportingBricks = settledBricks.filter(brick => collides(brick, settledCurrent));
    if (supportingBricks.length > 0 || collides(floor, settledCurrent)) {
      supportingBricks.forEach(settledBrick => settledBrick.supports.push(current.id));
      settledBricks.push({...current, supports: [], supportedBy: supportingBricks.map(it => it.id)});
    } else {
      queue.push(settledCurrent);
    }
  }
  return settledBricks.reduce((map, brick) => {
    map.set(brick.id, brick);
    return map;
  }, new Map());
}

function canBeDisintegrated(brick, bricks) {
  if (brick.supports.length === 0) {
    return true;
  }
  const supportedBricks = brick.supports.map(it => bricks.get(it));
  return supportedBricks.every(it => it.supportedBy.length > 1);
}

function countAffectedBricks(brick, bricks) {
  const queue = [...brick.supports];
  const falling = [brick.id];
  while (queue.length > 0) {
    const currentId = queue.shift();
    const current = bricks.get(currentId);
    if (current.supportedBy.length === 0 || current.supportedBy.every(it => falling.includes(it))) {
      falling.push(current.id);
      queue.push(...current.supports.filter(it => !falling.includes(it) && !queue.includes(it)));
    }
  }
  return falling.length - 1;
}


function exec(name, file) {
  const bricks = readInput(file);
  const settledBricks = settleBricks(bricks);
  const result01 = Array.from(settledBricks.values())
    .filter(it => canBeDisintegrated(it, settledBricks))
    .length;
  console.log(`${name} 01:`, result01);

  const result02 = Array.from(settledBricks.values())
    .map(it => countAffectedBricks(it, settledBricks))
    .reduce((a, b) => a + b);
  console.log(`${name} 02:`, result02);
}

exec("Test", "test.txt");
console.log("---------------------------");
exec("Part", "input.txt");
