const fs = require("fs");

function readInput(file) {
  const lines = fs.readFileSync(file, "utf-8").split('\n');
  return lines.map(line => {
    const [pattern, nums] = line.split(" ");
    return {pattern, nums: nums.split(",").map(Number)};
  });
}


function countWays(cache, pattern, nums) {
  pattern = pattern.replace(/^\.+|\.+$/, '');
  if (pattern === '') return nums.length ? 0 : 1;
  if (!nums.length) return pattern.includes('#') ? 0 : 1;

  const key = [pattern, nums].join(' ');
  if (cache.has(key)) return cache.get(key);

  let result = 0;
  const damaged = pattern.match(/^#+(?=\.|$)/);
  if (damaged) {
    if (damaged[0].length === nums[0]) {
      result += countWays(cache, pattern.slice(nums[0]), nums.slice(1));
    }
  } else if (pattern.includes('?')) {
    const total = nums.reduce((a, b) => a + b);
    result += countWays(cache, pattern.replace('?', '.'), nums);
    if ((pattern.match(/#/g) || []).length < total) {
      result += countWays(cache, pattern.replace('?', '#'), nums);
    }
  }
  cache.set(key, result);
  return result;
}

function expand({pattern, nums}) {
  return {
    pattern: new Array(5).fill(pattern).join('?'),
    nums: new Array(5).fill(nums).flat()
  };
}

function exec(name, file) {
  const cache = new Map();
  const input = readInput(file);
  const result01 = input
    .map(({pattern, nums}) => countWays(cache, pattern, nums))
    .reduce((a, b) => a + b);
  console.log(`${name} 01:`, result01);

  const input02 = input.map(expand);
  const result02 = input02
    .map(({pattern, nums}) => countWays(cache, pattern, nums))
    .reduce((a, b) => a + b);
  console.log(`${name} 02:`, result02);
}

exec("Test", "test.txt");
console.log("---------------------");
exec("Part", "input.txt");
