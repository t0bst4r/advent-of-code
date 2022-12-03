const fs = require("fs");
const path = require("path");

function chunk(list, size) {
  const result = [];
  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size));
  }
  return result;
}

function findCommonChar(first, second, third) {
  return [...first].find(char => second.includes(char) && third.includes(char));
}

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8").replace(/\r\n/g, "\n");
const rucksacks = input.split("\n").filter(it => it.length);

const groups = chunk(rucksacks, 3);
const badges = groups.map(([first, second, third]) => findCommonChar(first, second, third));
const priorities = badges.map(badge => badge.charCodeAt(0) - (badge === badge.toLowerCase() ? 96 : 38));
const result = priorities.reduce((prev, curr) => prev + curr, 0);

console.log(result);