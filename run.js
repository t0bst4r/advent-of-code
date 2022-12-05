#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const [, , year, day] = process.argv;

const part1 = path.join(__dirname, `year-${year}`, `day-${day}`, `part-1.js`);
const part2 = path.join(__dirname, `year-${year}`, `day-${day}`, `part-2.js`);

function run(part) {
  if (fs.existsSync(part)) {
    const start = new Date().getTime();
    require(part);
    const end = new Date().getTime();

    console.log(`Memory Heap: ${process.memoryUsage().heapUsed / 1024} KB, took ${end - start}ms\n`);
  }
}

run(part1);
run(part2);