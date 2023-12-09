const fs = require("fs");

function readInput(file) {
  return fs.readFileSync(file, "utf-8").trim()
    .split("\n")
    .map(it => it.trim().split(/\s+/).map(Number));
}

function createPredictionFunction(sequence) {
  return sequence.slice(1).map((current, idx) => current - sequence[idx]);
}

function createAllPredictionFunctions(sequence) {
  if (sequence.every(it => it === 0)) {
    return [sequence];
  } else {
    const prediction = createPredictionFunction(sequence);
    return [sequence, ...createAllPredictionFunctions(prediction)];
  }
}

function predict01(predictionFns) {
  return [...predictionFns]
    .reverse()
    .map(it => it[it.length - 1])
    .reduce((a, b) => a + b);
}

function predict02(predictionFns) {
  return [...predictionFns]
    .reverse()
    .map(it => it[0])
    .reduce((a, b) => b - a);
}

function exec(name, file) {
  const sequences = readInput(file);
  const predictionFunctions = sequences.map(createAllPredictionFunctions);
  const predictions01 = predictionFunctions.map(predict01);
  const predictions02 = predictionFunctions.map(predict02);
  const result01 = predictions01.reduce((a, b) => a + b);
  const result02 = predictions02.reduce((a, b) => a + b);
  console.log(`${name} 01:`, result01);
  console.log(`${name} 02:`, result02);
}

exec("Test", "test.txt");
console.log("----------------------------");
exec("Part", "input.txt");
