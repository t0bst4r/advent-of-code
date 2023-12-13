const fs = require("fs");

function readInput(file) {
  const content = fs.readFileSync(file, "utf-8").trim();
  const patterns = content.split("\n\n");
  const charPatterns = patterns.map(pattern => pattern
    .split("\n")
    .map(row => row.split("")));
  return charPatterns.map(pattern => {
    const rows = pattern
      .map(row => row.map(char => char === "." ? "0" : "1").join(""))
      .map(row => parseInt(row, 2));
    const cols = pattern[0]
      .map((_, colIdx) => pattern.map(row => row[colIdx] === "." ? "0" : "1").join(""))
      .map(col => parseInt(col, 2));
    return {rows, cols};
  });
}

function generatePairs(length, idx) {
  const len = Math.min(length - idx, idx);
  return new Array(len).fill(0)
    .map((_, i) => i + 1)
    .map(i => [idx - i, idx + i - 1])
}

function hasReflectionBeforeIdx(entries, rowIdx, toleranceBits) {
  if (rowIdx === 0) {
    return false;
  }
  const pairs = generatePairs(entries.length, rowIdx);
  const bitCount = pairs
    .map(([rowA, rowB]) => numberOfDifferentBits(entries[rowA], entries[rowB]))
    .reduce((a, b) => a + b);
  return bitCount === toleranceBits;
}

function findReflection(pattern, toleranceBits) {
  const col = pattern.cols.findIndex((_, colIdx) => hasReflectionBeforeIdx(pattern.cols, colIdx, toleranceBits));
  const row = pattern.rows.findIndex((_, rowIdx) => hasReflectionBeforeIdx(pattern.rows, rowIdx, toleranceBits));
  if (row !== -1) {
    return {row};
  } else if (col !== -1) {
    return {col}
  }
}

function numberOfDifferentBits(a, b) {
  let count = 0;
  for (let i = 0; i < 32; i++) {
    if (((a >> i) & 1) !== ((b >> i) & 1)) {
      count++;
    }
  }
  return count;
}

function calculateResult(reflections) {
  const rows = reflections.map(it => it && "row" in it ? it.row : 0).reduce((a, b) => a + b);
  const cols = reflections.map(it => it && "col" in it ? it.col : 0).reduce((a, b) => a + b);
  return cols + 100 * rows;
}

function exec(name, file) {
  const patterns = readInput(file);
  const reflections01 = patterns.map(pattern => findReflection(pattern, 0));
  const result01 = calculateResult(reflections01);
  console.log(`${name} 01:`, result01);

  const reflections02 = patterns.map(pattern => findReflection(pattern, 1));
  const result02 = calculateResult(reflections02);
  console.log(`${name} 02:`, result02);
}

exec("Test", "test.txt");
console.log("-------------------------");
exec("Part", "input.txt");
