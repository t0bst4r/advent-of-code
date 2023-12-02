const fs = require("fs");

function readInput(file) {
  return fs.readFileSync(file, "utf-8").trim()
    .split("\n");
}

function parseLines(lines) {
  const gameIdRegex = /^Game (\d+): (.*)/;
  return lines.map(line => {
    const lineMatch = gameIdRegex.exec(line);
    const gameId = parseInt(lineMatch[1]);
    const sets = lineMatch[2].split("; ")
      .map(set => set.split(", ")
        .map(cubes => {
          const current = cubes.split(" ");
          return {[current[1]]: parseInt(current[0])};
        })
        .reduce((prev, curr) => Object.assign(prev, curr)));
    return {gameId, sets};
  });
}

function filterPossibleGames(games) {
  return games.filter(game => {
    return game.sets.every(set => {
      return (set.red ?? 0) <= 12
        && (set.green ?? 0) <= 13
        && (set.blue ?? 0) <= 14
    })
  });
}

function getMinimumCubes(games) {
  return games.map(game => {
    return {
      green: Math.max(...game.sets.map(it => it.green ?? 0)),
      red: Math.max(...game.sets.map(it => it.red ?? 0)),
      blue: Math.max(...game.sets.map(it => it.blue ?? 0)),
    }
  });
}

function exec01(name, file) {
  const input = readInput(file);
  const games = parseLines(input);
  const possibleGames = filterPossibleGames(games);
  const sum = possibleGames.map(it => it.gameId).reduce((a, b) => a + b);
  console.log(name, sum);
}

function exec02(name, file) {
  const input = readInput(file);
  const games = parseLines(input);
  const minimumCubes = getMinimumCubes(games);
  const sum = minimumCubes.map(it => it.red * it.green * it.blue).reduce((a, b) => a + b);
  console.log(name, sum);
}

exec01("Test 01", "test.txt");
exec01("Part 01", "input.txt");
console.log("--------------");
exec02("Test 02", "test.txt");
exec02("Part 02", "input.txt");