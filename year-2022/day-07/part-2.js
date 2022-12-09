const fs = require("fs");
const path = require("path");

const inputContent = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8").replace(/\r\n/g, "\n").trim();
const commandsAndOutput = inputContent.split("$ ").filter(it => it.length);
const commandsAndResults = commandsAndOutput.map(it => it.trim().split("\n"));
const filesystem = {"": {type: "dir", name: "", path: ""}};

let currentPath = [""];
for (let i = 0; i < commandsAndResults.length; i++) {
    const [command, ...results] = commandsAndResults[i];
    if (command.startsWith("cd ")) {
        const path = command.substring(3);
        if (path === "/") currentPath = [""];
        else if (path === "..") currentPath.pop();
        else currentPath.push(path);
    } else if (command === "ls") {
        const lines = results.map(result => result.split(" "));
        lines.forEach(([dirOrSize, ...name]) => {
            const n = name.join(" ");
            const path = [...currentPath, n].join("/");
            if (dirOrSize === "dir") {
                filesystem[path] = {type: "dir", name: n, path};
            } else {
                filesystem[path] = {type: "file", name: n, path, size: parseInt(dirOrSize)};
            }
        });
    }
}

const dirs = Object.keys(filesystem).filter(key => filesystem[key].type === "dir");
const files = Object.keys(filesystem).filter(key => filesystem[key].type === "file");

dirs.forEach(key => {
    let size = files.filter(file => file.startsWith(key + "/")).map(file => filesystem[file].size).reduce((prev, curr) => prev+curr, 0);
    filesystem[key].size = size;
});


const smallerDirs = dirs.map(key => filesystem[key]).filter(it => it.size <= 100000);

const freeSpace = 70000000 - filesystem[""].size;
const neededSpace = 30000000 - freeSpace;

const relevant = dirs.map(key => filesystem[key]).filter(it => it.size >= neededSpace).sort((a, b) => a.size - b.size);

console.log(relevant[0].size);
