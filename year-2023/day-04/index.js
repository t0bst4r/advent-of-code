const fs = require("fs");

function readInput(file) {
  return fs.readFileSync(file, "utf-8")
    .trim()
    .split("\n")
    .map(it => it.trim());
}

function parseCards(lines) {
  const regex = /^Card\s+(\d+): (.+) \| (.+)$/;
  return lines
    .map(it => regex.exec(it))
    .map(([, cardId, winningNumbers, ownNumbers]) => ({
      cardId: cardId,
      winningNumbers: winningNumbers.trim().split(/\s+/),
      ownNumbers: ownNumbers.trim().split(/\s+/)
    }))
    .sort((a, b) => a.cardId - b.cardId);
}

function addMatchingNumbers(cards) {
  cards.forEach((card, idx) => {
    const nums = card.ownNumbers.filter(num => card.winningNumbers.includes(num));
    card.score = nums.length === 0 ? 0 : Math.pow(2, nums.length - 1);
    card.count = card.count ?? 1;

    for (let i = 1; i <= nums.length; i++) {
      const nextCard = cards[idx + i];
      if (nextCard) {
        nextCard.count = (nextCard.count ?? 1) + card.count;
      }
    }
  });
}

function exec(name, file) {
  const input = readInput(file);
  const cards = parseCards(input);
  addMatchingNumbers(cards);
  const result01 = cards.map(card => card.score).reduce((a, b) => a + b);
  const result02 = cards.map(card => card.count).reduce((a, b) => a + b);
  console.log(`${name} 01`, result01);
  console.log(`${name} 02`, result02);
}

exec("Test", "test.txt");
console.log("---------------------")
exec("Part", "input.txt");