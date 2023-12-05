const fs = require("fs");

function readInput(file) {
  const input = fs.readFileSync(file, "utf-8");
  let lines = input.split("\n");
  const seeds = lines[0].substring(7).split(" ").map(Number);
  lines = lines.slice(2).join("\n");
  const maps = parseMaps(lines.split("\n\n"));
  return {seeds, maps};
}

function parseMaps(parts) {
  return parts.map(text => {
    const lines = text.split("\n");
    const [, source, destination] = lines[0].match(/^(.*)-to-(.*) map:$/);
    const ranges = lines.slice(1).map(line => {
      const [destinationStart, sourceStart, rangeLength] = line.split(" ").map(Number);
      return {destinationStart, sourceStart, rangeLength};
    });
    return {[source]: {destination, ranges}}
  }).reduce((prev, curr) => Object.assign(prev, curr));
}

function reduceToLocation01(seeds, maps) {
  let currentDomain = "seed";
  let domainItems = seeds;

  while (currentDomain !== "location") {
    const {destination, ranges} = maps[currentDomain];

    const nextItems = [];
    for (const item of domainItems) {
      const range = ranges.find(range => item >= range.sourceStart && item < range.sourceStart + range.rangeLength);
      const next = range ? range.destinationStart + (item - range.sourceStart) : item;
      nextItems.push(next);
    }

    domainItems = nextItems;
    currentDomain = destination;
  }
  return domainItems;
}

function reduceToLocation02(seeds, maps) {
  let currentDomain = "seed";
  let domainRanges = new Array(seeds.length / 2)
    .fill(0)
    .map((_, i) => ({start: seeds[i * 2], end: seeds[i * 2] + seeds[i * 2 + 1]}))
    .sort((a, b) => a.start - b.start)
    .filter(it => it.start !== it.end);

  while (currentDomain !== "location") {
    const {destination, ranges} = maps[currentDomain];
    const nextRanges = [];

    while (domainRanges.length > 0) {
      const {start, end} = domainRanges.shift();

      const range = ranges.find(range => end >= range.sourceStart && start < range.sourceStart + range.rangeLength);
      if (!range) {
        nextRanges.push({start, end});
      } else {
        const current = {
          start: Math.max(range.sourceStart, start),
          end: Math.min(range.sourceStart + range.rangeLength, end)
        };
        if (start < current.start) {
          domainRanges.push({start, end: current.start - 1});
        }
        if (end > current.end) {
          domainRanges.push({start: current.end + 1, end});
        }
        current.start = range.destinationStart + (current.start - range.sourceStart);
        current.end = range.destinationStart + (current.end - range.sourceStart);
        nextRanges.push(current);
      }
    }

    domainRanges = nextRanges;
    currentDomain = destination;

  }
  return domainRanges;
}

function exec(name, file) {
  const {seeds, maps} = readInput(file);
  const domainItems = reduceToLocation01(seeds, maps);
  console.log(`${name} 01`, Math.min(...domainItems));
  const domainRanges = reduceToLocation02(seeds, maps);
  console.log(`${name} 02`, Math.min(...domainRanges.map(range => range.start)));
}


exec("Test", "test.txt");
console.log("-------------------------");
exec("Part", "input.txt");
