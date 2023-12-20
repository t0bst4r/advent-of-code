const fs = require("fs");
const {lcm} = require("../../algorithms/lowest-common-multiple");

function readInput(file) {
  const input = fs.readFileSync(file, "utf-8").trim();
  const rows = input.split("\n");
  const parser = /^(.*) -> (.*)$/;
  return rows
    .map(row => parser.exec(row))
    .map(([, name, targets]) => ({
      type: name.startsWith("%") ? "flip-flop" : name.startsWith("&") ? "conjunction" : "broadcast",
      name: name.startsWith("%") || name.startsWith("&") ? name.substring(1) : name,
      targets: targets.split(", "),
      state: name.startsWith("%") ? false : (name.startsWith("&") ? {} : undefined),
    }))
    .map((module, _, allModules) => {
      module.inputs = allModules.filter(it => it.targets.includes(module.name)).map(it => it.name);
      return module;
    })
    .reduce((prev, curr) => ({...prev, [curr.name]: curr}), {});
}

function broadcast(queue, module, pulse) {
  queue.push(...module.targets.map(target => ({input: module.name, target, pulse})));
}

function flipFlop(queue, module, pulse) {
  if (pulse) return;
  module.state = !module.state;
  queue.push(...module.targets.map(target => ({input: module.name, target, pulse: module.state})));
}

function conjunction(queue, module, input, pulse) {
  module.state[input] = pulse;
  if (module.inputs.every(it => module.state[it] === true)) {
    queue.push(...module.targets.map(target => ({input: module.name, target, pulse: false})));
  } else {
    queue.push(...module.targets.map(target => ({input: module.name, target, pulse: true})));
  }
}

function solve(allModules, solvePart2) {
  let counter = 0;
  let high = 0, low = 0;

  const lastBeforeEnd = solvePart2 ? Object.values(allModules).find(it => it.targets.includes("rx")).name : undefined;
  const relevantModules = solvePart2 ? allModules[lastBeforeEnd].inputs : [];
  const relevantModuleCounter = {};

  while (relevantModules.some(m => relevantModuleCounter[m] == null) || counter < 1000) {
    counter++;
    const queue = [{input: "button", target: "broadcaster", pulse: false}];
    while (queue.length > 0) {
      const {input, target, pulse} = queue.shift();
      if (counter <= 1000) {
        if (pulse) {
          high++;
        } else {
          low++;
        }
      }
      const module = allModules[target];
      if (!module) continue;

      if (relevantModules.includes(input) && pulse) {
        relevantModuleCounter[input] = counter;
      }

      if (module.type === "broadcast") {
        broadcast(queue, module, pulse);
      } else if (module.type === "flip-flop") {
        flipFlop(queue, module, pulse);
      } else if (module.type === "conjunction") {
        conjunction(queue, module, input, pulse);
      }
    }
  }
  return {result01: high * low, result02: solvePart2 ? lcm(...Object.values(relevantModuleCounter)) : undefined};
}

function exec(name, file, solvePart2) {
  const allModules = readInput(file);

  const {result01, result02} = solve(allModules, solvePart2 ?? true);
  console.log(`${name} 01:`, result01);
  console.log(`${name} 02:`, result02);
}

exec("Test", "test.txt", false);
console.log("-------------------------------");
exec("Part", "input.txt");
