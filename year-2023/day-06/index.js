const fs = require("fs");

function readInput01(file) {
  const [time, distance] = fs.readFileSync(file, "utf-8").trim().split("\n");
  const [, ...times] = time.split(/\s+/);
  const [, ...distances] = distance.split(/\s+/);
  return times.map((time, idx) => ({
    time: Number(time),
    distance: Number(distances[idx])
  }));
}

function readInput02(file) {
  const [timeLine, distanceLine] = fs.readFileSync(file, "utf-8").trim().split("\n");
  const [, time] = timeLine.replace(/\s+/g, "").split(":");
  const [, distance] = distanceLine.replace(/\s+/g, "").split(":");
  return {
    time: Number(time),
    distance: Number(distance)
  };
}


function winRaces(races) {
  return races.map(winRace);
}

function winRace(race) {
  const times = new Array(race.time).fill(0).map((_, idx) => idx + 1);
  return times
    .map(time => time * (race.time - time))
    .filter(distance => distance > race.distance);
}

function exec01(name, file) {
  const races = readInput01(file);
  const distances = winRaces(races);
  const result = distances
    .map(raceResults => raceResults.length)
    .reduce((a, b) => a * b);
  console.log(`${name} 01`, result);
}

function exec02(name, file) {
  const race = readInput02(file);
  const distances = winRace(race);
  const result = distances.length;
  console.log(`${name} 02`, result);
}

exec01("Test", "test.txt");
exec01("Part", "input.txt");
console.log("-------------------------");
exec02("Test", "test.txt");
exec02("Part", "input.txt");
