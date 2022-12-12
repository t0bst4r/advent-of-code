const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8")
  .replace(/\r\n/g, "\n");

const monkeys = input.split("\n\n")
  .map(monkey => monkey.trim().split("\n").map(line => line.trim()))
  .map(([monkey, startingItems, operation, test, ifTrue, ifFalse]) => {
    let [operationA, operationOperator, operationB] = operation.substring("Operation: new = ".length).split(" ");
    operationA = (operationA === "old") ? operationA : BigInt(operationA);
    operationB = (operationB === "old") ? operationB : BigInt(operationB);

    return {
      id: monkey.substring("Monkey ".length, monkey.length - 1),
      items: startingItems.substring("Starting items: ".length).split(", ").map(it => BigInt(it)),
      operation: (worryLevel) => {
        const first = (operationA === "old") ? worryLevel : operationA;
        const second = (operationB === "old") ? worryLevel : operationB;
        return (operationOperator === "*") ? first * second : first + second;
      },
      testDivisor: BigInt(test.substring("Test: divisible by ".length)),
      ifTrue: parseInt(ifTrue.substring("If true: throw to monkey ".length)),
      ifFalse: parseInt(ifFalse.substring("If false: throw to monkey ".length)),
      inspectedItems: 0
    };
  });

const superMod = monkeys.reduce((prev, curr) => prev * curr.testDivisor, 1n);

for (let i = 0; i < 10_000; i++) {
  for (let j = 0; j < monkeys.length; j++) {
    const currentMonkey = monkeys[j];
    while (currentMonkey.items.length > 0) {
      const worryLevel = currentMonkey.items.shift();
      const value = currentMonkey.operation(worryLevel) % superMod;
      const nextMonkey = value % currentMonkey.testDivisor === 0n ? monkeys[currentMonkey.ifTrue] : monkeys[currentMonkey.ifFalse];
      nextMonkey.items.push(value);
      currentMonkey.inspectedItems++;
    }
  }
}

const sortedMonkeys = [...monkeys].sort((a, b) => b.inspectedItems - a.inspectedItems);
console.log(sortedMonkeys[0].inspectedItems * sortedMonkeys[1].inspectedItems);
