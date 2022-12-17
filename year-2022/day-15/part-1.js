const fs = require("fs");
const path = require("path");

function loadInput(file) {
  const input = fs.readFileSync(path.join(__dirname, file), "utf-8");
  return input.trim().replace(/\r\n/g, "\n");
}

function parseInput(input) {
  const regex = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;
  return input.split("\n")
    .map(line => regex.exec(line))
    .filter(it => !!it)
    .map(result => result.slice(1, 5).map(it => parseInt(it)));
}

function blockedSegmentsInRow([sX, sY, , , dist], row) {
  const yDist = Math.abs(sY - row);
  const width = dist - yDist;
  return [sX - width, sX + width];
}

function combineOverlaps(inputSegments) {
  if (inputSegments.length === 0) return [];

  const sortedSegments = inputSegments.sort(([a], [b]) => a - b);
  const segments = [sortedSegments[0]];

  for (let i = 1; i < sortedSegments.length; i++) {
    const prev = segments[segments.length - 1];
    const curr = sortedSegments[i];
    if (prev[1]+1 >= curr[0]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      segments.push(curr);
    }
  }
  return segments;
}

function countBlockedPositions(sensorsAndBeacons, row) {
  const withDistance = sensorsAndBeacons.map(row => [...row, Math.abs(row[0] - row[2]) + Math.abs(row[1] - row[3])]);
  const relevants = withDistance.filter(([, sY, , , dist]) => row >= sY - dist && row <= sY + dist);
  const blockedSegments = relevants.map(sensorAndBeacon => blockedSegmentsInRow(sensorAndBeacon, row));
  const uniqueSegments = combineOverlaps(blockedSegments);
  return uniqueSegments.reduce((prev, curr) => prev + curr[1] - curr[0], 0);
}

(async () => {
  const input = loadInput("input.txt");
  const sensorsAndBeacons = parseInput(input);
  const result = countBlockedPositions(sensorsAndBeacons, 2000000);
  console.log(result);
})();