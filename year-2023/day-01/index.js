const fs = require("fs");

let input = fs.readFileSync("input.txt", "utf-8");

const lines = input.trim()
  .split("\n")
  .map(it => it.trim());

function part01() {
  const result = lines
    .map(onlyNumbers)
    .map(firstAndLast)
    .reduce((a, b) => a + b);

  console.log("Part 1:", result);
}

function part02() {
  const result = lines
    .map(normalizeLine)
    .map(onlyNumbers)
    .map(firstAndLast)
    .reduce((a, b) => a + b);

  console.log("Part 2:", result);
}

function normalizeLine(line) {
  return [
    "one", "two", "three",
    "four", "five", "six", "seven", "eight", "nine"
  ].reduce((text, num, idx) =>
    text.replaceAll(num, `${num}${idx + 1}${num}`), line);
}

function onlyNumbers(line) {
  return line.replace(/\D/g, '');
}

function firstAndLast(line) {
  return parseInt(`${line[0]}${line[line.length - 1]}`);
}


part01();
part02();