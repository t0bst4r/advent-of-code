function changeDirectory(currentPath, target) {
	let path = [...currentPath];
	if (target === "/") path = [""];
        else if (target === "..") path.pop();
        else path.push(target);
	return path;
}

function scanListDir(currentPath, results) {
	const files = [];
	const dirs = [];
        const lines = results.map(result => result.split(" "));
	lines.forEach(([dirOrSize, ...n]) => {
            const name = n.join(" ");
            const path = [...currentPath, name].join("/");
            if (dirOrSize === "dir") {
                dirs.push({name, path});
            } else {
		files.push({name, path, size: parseInt(dirOrSize)});
            }
        });
	return [dirs, files];
}

function executeCommands(commandsAndResults) {
    const dirs = [];
    const files = [];
    let currentPath = [""];
    for (let i = 0; i < commandsAndResults.length; i++) {
        const [command, ...results] = commandsAndResults[i];
        if (command.startsWith("cd ")) {
            currentPath = changeDirectory(currentPath, command.substring(3));
        } else if (command === "ls") {
            const [d, f] = scanListDir(currentPath, results);
	    dirs.push(...d);
            files.push(...f);
        }
    }
    return [dirs, files];
}

function dirSize(dirName, allFiles) {
    return allFiles
        .filter(file => file.path.startsWith(dirName + "/"))
        .reduce((prev, curr) => prev + curr.size, 0);
}

const fs = require("fs");
const path = require("path");

const inputContent = fs.readFileSync(path.join(__dirname, "input.txt"), "utf-8").replace(/\r\n/g, "\n").trim();
const commandsAndOutput = inputContent.split("$ ").filter(it => it.length);
const commandsAndResults = commandsAndOutput.map(it => it.trim().split("\n"));

const [dirs, files] = executeCommands(commandsAndResults);
dirs.forEach(dir => dir.size = dirSize(dir.path, files));

const result = dirs
    .filter(it => it.size <= 100000)
    .reduce((prev, curr) => prev + curr.size, 0);

console.log(result);
