const fs = require("fs");

function readInput(file) {
  return fs.readFileSync(file, "utf-8")
    .trim()
    .split("\n");
}

function findPossiblePartNumbers(matrix) {
  return matrix.flatMap((line, row) => {
    let offset = 0;
    return line.match(/(\d+)/g)?.map(match => {
      const col = line.indexOf(match, offset);
      offset = col + match.length;
      return {row, col, value: parseInt(match), length: match.length};
    }) ?? [];
  });
}

function findParts(matrix, possibleParts) {
  const gears = [];
  matrix.forEach((line, row) => {
    [...line].forEach((char, col) => {
      if (/[^.0-9]/.test(char)) {
        const affectedParts = possibleParts
          .filter(part => col >= part.col - 1 && col <= part.col + part.length)
          .filter(part => row >= part.row - 1 && row <= part.row + 1);
        affectedParts.forEach(part => part.isPart = true);

        if (char === '*' && affectedParts.length === 2) {
          gears.push(affectedParts[0].value * affectedParts[1].value);
        }
      }
    });
  });
  return {
    part01: possibleParts.filter(it => it.isPart).map(it => it.value),
    part02: gears
  };
}

function exec(name, file) {
  const input = readInput(file);
  const possibleParts = findPossiblePartNumbers(input);
  const {part01, part02} = findParts(input, possibleParts);
  const result01 = part01.reduce((a, b) => a + b);
  const result02 = part02.reduce((a, b) => a + b);
  console.log(`${name} 01`, result01);
  console.log(`${name} 02`, result02);
}

exec("Test", "test.txt");
console.log("-----------------------");
exec("Part", "input.txt");