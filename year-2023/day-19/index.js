const fs = require("fs");

function readInput(file) {
  const workflowPattern = /^(\w+)\{(.*)}$/;
  const input = fs.readFileSync(file, "utf-8").trim();
  const [workflowsInput, partsInput] = input.split("\n\n");
  const workflows = workflowsInput
    .split("\n")
    .map(row => workflowPattern.exec(row))
    .map(([, name, conditions]) => ({
      [name]: conditions.split(",")
        .map(condition => condition.split(":"))
        .map(([condition, target]) => {
          if (!target) {
            return {target: condition}
          }
          return {condition: [condition[0], condition[1], Number(condition.substring(2))], target};
        })
    }))
    .reduce((prev, curr) => ({...prev, ...curr}));
  const parts = partsInput
    .replace(/=/g, ":")
    .replace(/x/g, '"x"')
    .replace(/m/g, '"m"')
    .replace(/a/g, '"a"')
    .replace(/s/g, '"s"')
    .split("\n")
    .map(row => JSON.parse(row))
    .map(({x, m, a, s}) => ({x: [x, x], m: [m, m], a: [a, a], s: [s, s]}));
  return {workflows, parts};
}

function checkWorkflow(workflow, current) {
  const results = [];
  let remaining = current;
  for (let i = 0; i < workflow.length; i++) {
    if (!remaining) {
      break;
    }
    if (!workflow[i].condition) {
      results.push({part: remaining, target: workflow[i].target});
      break;
    }
    const [property, operator, value] = workflow[i].condition;
    if (!remaining[property]) {
      throw remaining;
    }
    let smallerRange, largerRange
    if (operator === "<") {
      smallerRange = value > remaining[property][0] ? [remaining[property][0], Math.min(value - 1, remaining[property][1])] : undefined;
      largerRange = value <= remaining[property][1] ? [Math.max(remaining[property][0], value), remaining[property][1]] : undefined;
      if (smallerRange) {
        results.push({part: {...remaining, [property]: smallerRange}, target: workflow[i].target});
      }
      if (largerRange) {
        remaining = {...remaining, [property]: largerRange};
      } else {
        remaining = undefined;
      }
    } else if (operator === ">") {
      smallerRange = value >= remaining[property][0] ? [remaining[property][0], Math.min(value, remaining[property][1])] : undefined;
      largerRange = value < remaining[property][1] ? [Math.max(remaining[property][0], value + 1), remaining[property][1]] : undefined;
      if (largerRange) {
        results.push({part: {...remaining, [property]: largerRange}, target: workflow[i].target});
      }
      if (smallerRange) {
        remaining = {...remaining, [property]: smallerRange};
      } else {
        remaining = undefined;
      }
    } else {
      throw new Error(`Unsupported operator ${operator}`);
    }
  }
  return results;
}

function applyWorkflows(workflows, parts) {
  const accepted = new Set();
  const rejected = new Set();

  const workflowNames = Object.keys(workflows);
  const queue = new Map();
  workflowNames.forEach(workflow => queue.set(workflow, []));
  queue.get("in").push(...parts);

  while (true) {
    const currentWorkflow = workflowNames.find(name => queue.get(name).length > 0);
    if (!currentWorkflow) {
      break;
    }
    const workflowQueue = queue.get(currentWorkflow);
    const current = workflowQueue.shift();
    const targets = checkWorkflow(workflows[currentWorkflow], current);
    targets.forEach(({part, target}) => {
      if (target === "A") {
        accepted.add(part);
      } else if (target === "R") {
        rejected.add(part);
      } else {
        queue.get(target).push(part);
      }
    });
  }

  return {accepted, rejected};
}

function getScore01(accepted) {
  return accepted
    .flatMap(({x, m, a, s}) => [x, m, a, s]
      .map(([start]) => start))
    .reduce((a, b) => a + b);
}

function getScore02(accepted) {
  return accepted
    .map(({x, m, a, s}) => [x, m, a, s]
      .map(([start, end]) => end - start + 1)
      .reduce((a, b) => a * b)
    ).reduce((a, b) => a + b);
}

function exec(name, file) {
  const {workflows, parts} = readInput(file);
  const {accepted: accepted01} = applyWorkflows(workflows, parts);
  const result01 = getScore01(Array.from(accepted01));
  console.log(`${name} 01:`, result01);

  const {accepted: accepted02} = applyWorkflows(workflows, [{x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000]}]);
  const result02 = getScore02(Array.from(accepted02));
  console.log(`${name} 02:`, result02);
}

exec("Test", "test.txt");
console.log("------------------------");
exec("Part", "input.txt");
