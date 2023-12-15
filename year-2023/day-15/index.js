const fs = require("fs");

function readInput(file) {
  const input = fs.readFileSync(file, "utf-8").trim().replace(/[\r\n]/g, "");
  return input.split(",");
}

function createHash(sequence) {
  let currentValue = 0;
  for (let i = 0; i < sequence.length; i++) {
    currentValue += sequence.charCodeAt(i);
    currentValue *= 17;
    currentValue %= 256;
  }
  return currentValue;
}

function fillBoxes(sequences) {
  const boxes = new Map();
  let boxIdx = 0;
  sequences.forEach(sequence => {
    const [lensLabel, focalLength] = [...sequence.split(/[=-]/), undefined];
    const boxLabel = createHash(lensLabel).toString();
    if (!boxes.has(boxLabel)) {
      boxes.set(boxLabel, []);
      boxIdx++;
    }

    const lenses = boxes.get(boxLabel);
    const lensIdx = lenses.findIndex(it => it.label === lensLabel);

    if (sequence.includes("=")) { // =
      if (lensIdx === -1) {
        lenses.push({label: lensLabel, focalLength: Number(focalLength)});
      } else {
        lenses[lensIdx].focalLength = Number(focalLength);
      }
    } else { // -
      if (lensIdx !== -1) {
        lenses.splice(lensIdx, 1);
      }
    }
  });
  return boxes;
}

function calculateFocusingPower(boxes) {
  return Array.from(boxes.entries())
    .map(([boxId, lenses]) => [Number(boxId), lenses])
    .flatMap(([boxId, lenses]) => {
      return lenses.map(({focalLength}, lensSlot) => {
        return (boxId + 1) * (lensSlot + 1) * focalLength;
      });
    })
    .reduce((a, b) => a + b);
}

function exec(name, file) {
  const sequences = readInput(file);
  const hash = sequences.map(createHash).reduce((a, b) => a + b);
  console.log(`${name} 01:`, hash);

  const boxes = fillBoxes(sequences);
  const focusingPower = calculateFocusingPower(boxes);
  console.log(`${name} 02:`, focusingPower);
}

exec("Test", "test.txt");
console.log("------------------------");
exec("Part", "input.txt");
