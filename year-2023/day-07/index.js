const fs = require("fs");
const cardScore01 = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse();
const cardScore02 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse();
const handScore = ["Five of a kind", "Four of a kind", "Full house", "Three of a kind", "Two pair", "One pair", "High card"].reverse();

function readInput(file) {
  const input = fs.readFileSync(file, "utf-8").trim().split("\n");
  return input
    .map(hand => hand.split(" "))
    .map(([cards, bid]) => ({
      cards,
      bid: Number(bid)
    }));
}

function getHandsWithScores(hands, useJokers) {
  return hands.map(hand => ({
    ...hand,
    handScore: handScore.indexOf(getHandScore(hand.cards, useJokers)),
    cardScores: [...hand.cards].map(card => useJokers
      ? cardScore02.indexOf(card)
      : cardScore01.indexOf(card))
  }));
}

function getHandScore(hand, useJokers) {
  const distinctChars = [...hand]
    .filter((item, idx, arr) => arr.indexOf(item) === idx);
  let charsWithCount = distinctChars
    .map(char => [char, (hand.match(new RegExp(char, "g")) ?? []).length]);

  const jokers = useJokers ? charsWithCount.find(([char]) => char === 'J')?.[1] ?? 0 : 0;
  charsWithCount = useJokers ? charsWithCount.filter(([char]) => char !== 'J') : charsWithCount;

  if (charsWithCount.length <= 1) {
    return "Five of a kind";
  }
  if (charsWithCount.some(([, count]) => count + jokers === 4)) {
    return "Four of a kind";
  }

  if (charsWithCount.length === 2) {
    return "Full house";
  }

  if (charsWithCount.some(([, count]) => count + jokers === 3)) {
    return "Three of a kind";
  }

  if (charsWithCount.length === 3) {
    return "Two pair";
  }
  if (charsWithCount.some(([, count]) => count + jokers === 2)) {
    return "One pair";
  }
  return "High card";
}

function compareHands(a, b) {
  const compareHandScore = a.handScore - b.handScore;
  if (compareHandScore !== 0) {
    return compareHandScore;
  }
  for (let i = 0; i < a.cardScores.length; i++) {
    if (a.cardScores[i] !== b.cardScores[i]) {
      return a.cardScores[i] - b.cardScores[i];
    }
  }
  return 0;
}


function exec(name, file, useJokers) {
  const hands = readInput(file);
  const handsWithScores = getHandsWithScores(hands, useJokers ?? false);
  const sortedHands = handsWithScores.sort(compareHands);
  const result = sortedHands
    .map(({bid}, idx) => (idx + 1) * bid)
    .reduce((a, b) => a + b);
  console.log(name, result);
}

exec("Test 01", "test.txt");
exec("Part 01", "input.txt");
console.log("----------------------")
exec("Test 02", "test.txt", true);
exec("Part 02", "input.txt", true);
