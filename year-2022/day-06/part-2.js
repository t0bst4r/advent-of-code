const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8").replace(/\r\n/g, "\n").trim();
const inputChars = [...input];

let marker = null;
for (let i = 14; i < inputChars.length - 1; i++) {
  const part = inputChars.slice(i - 14, i);
  const distinctPart = part.filter((item, idx, arr) => arr.indexOf(item) === idx);
  if (distinctPart.length === part.length) {
    marker = i;
    break;
  }
}

console.log(marker);