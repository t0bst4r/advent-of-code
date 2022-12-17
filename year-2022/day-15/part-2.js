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

function blockedSegmentsInRow([sX, sY, , , dist], row, [minX, maxX]) {
  const yDist = Math.abs(sY - row);
  const width = dist - yDist;
  return [Math.max(sX - width, minX), Math.min(sX + width, maxX)];
}

function combineOverlaps(inputSegments) {
  if (inputSegments.length === 0) return [];

  const sortedSegments = inputSegments.sort(([a], [b]) => a - b);
  const segments = [sortedSegments[0]];

  for (let i = 1; i < sortedSegments.length; i++) {
    const prev = segments[segments.length - 1];
    const curr = sortedSegments[i];
    if (prev[1] + 1 >= curr[0]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      segments.push(curr);
    }
  }
  return segments;
}

function blockedSegments(sensorsAndBeacons, row, boundary) {
  const withDistance = sensorsAndBeacons.map(row => [...row, Math.abs(row[0] - row[2]) + Math.abs(row[1] - row[3])]);
  const relevants = withDistance.filter(([, sY, , , dist]) => row >= sY - dist && row <= sY + dist);
  const blockedSegments = relevants.map(sensorAndBeacon => blockedSegmentsInRow(sensorAndBeacon, row, boundary));
  return combineOverlaps(blockedSegments);
}

function findEmptySpot(minX, maxX, minY, maxY, sensorsAndBeacons) {
  const possibleResults = [];
  for (let y = minY; y < maxY; y++) {
    const segments = blockedSegments(sensorsAndBeacons, y, [minX, maxX]);
    if (segments.length > 1) {
      return [y, segments[0][1] + 1];
    }
  }
  return possibleResults;
}

(async () => {
  const input = loadInput("input.txt");
  const sensorsAndBeacons = parseInput(input);

  const emptySpot = findEmptySpot(0, 4000000, 0, 4000000, sensorsAndBeacons);
  const result = emptySpot[1] * 4000000 + emptySpot[0];
  console.log(result);
})();