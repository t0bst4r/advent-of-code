const fs = require("fs");

function readInput(file) {
  const nodeRegex = /^(\w+) = \((\w+), (\w+)\)$/
  const lines = fs.readFileSync(file, "utf-8").trim().split(/\n+/);
  const [instructions, ...nodes] = lines;
  return {
    instructions: [...instructions],
    nodes: nodes
      .map(it => nodeRegex.exec(it))
      .map(result => [result[1], result[2], result[3]])
      .map(([nodeName, left, right]) => ({[nodeName]: {L: left, R: right}}))
      .reduce((a, b) => Object.assign(a, b))
  };
}

function findPathLength01({instructions, nodes}, start, notEndCondition) {
  let current = start;
  let pathLength = 0;
  while (notEndCondition(current)) {
    const instruction = instructions[pathLength % instructions.length];
    current = nodes[current][instruction];
    pathLength++;
  }
  return pathLength;
}

function findPathLength02({instructions, nodes}) {
  const current = Object.keys(nodes)
    .filter(it => it.endsWith("A"))
    .filter((it, idx, arr) => arr.indexOf(it) === idx);
  const lengths = current
    .map(it => findPathLength01({instructions, nodes}, it, a => !a.endsWith("Z")));
  return lcm(...lengths);
}

const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

function exec(name, file1, file2) {
  const input01 = readInput(file1);
  const input02 = readInput(file2 ?? file1);
  const path01 = findPathLength01(input01, "AAA", it => it !== "ZZZ");
  console.log(`${name} 01:`, path01);
  const path02 = findPathLength02(input02);
  console.log(`${name} 02:`, path02);
}

exec("Test", "test-01.txt", "test-02.txt");
console.log("--------------------------------");
exec("Part", "input.txt");
