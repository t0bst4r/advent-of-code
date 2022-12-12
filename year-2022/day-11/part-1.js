const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8")
  .replace(/\r\n/g, "\n");

const monkeys = input.split("\n\n")
  .map(monkey => monkey.trim().split("\n").map(line => line.trim()))
  .map(([monkey, startingItems, operation, test, ifTrue, ifFalse]) => ({
    id: monkey.substring("Monkey ".length, monkey.length - 1),
    items: startingItems.substring("Starting items: ".length).split(", ").map(it => parseInt(it)),
    operation: (worryLevel) => eval(operation.substring("Operation: new = ".length).replaceAll("old", worryLevel)),
    test: (current) => current % parseInt(test.substring("Test: divisible by ".length)) === 0,
    ifTrue: parseInt(ifTrue.substring("If true: throw to monkey ".length)),
    ifFalse: parseInt(ifFalse.substring("If false: throw to monkey ".length)),
    inspectedItems: 0
  }));

for (let i = 0; i < 20; i++) {
  for (let j = 0; j < monkeys.length; j++) {
    const currentMonkey = monkeys[j];
    while (currentMonkey.items.length > 0) {
      const worryLevel = currentMonkey.items.shift();
      const value = Math.floor(currentMonkey.operation(worryLevel) / 3);
      const nextMonkey = currentMonkey.test(value) ? monkeys[currentMonkey.ifTrue] : monkeys[currentMonkey.ifFalse];
      nextMonkey.items.push(value);
      currentMonkey.inspectedItems++;
    }
  }
}

const sortedMonkeys = [...monkeys].sort((a, b) => b.inspectedItems - a.inspectedItems);
console.log(sortedMonkeys[0].inspectedItems * sortedMonkeys[1].inspectedItems);
