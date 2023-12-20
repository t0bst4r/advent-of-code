const {gcd} = require("./greatest-common-divisor");

/**
 * lowest common multiple
 * @param {number} values
 * @returns {number}
 */
const lcm = (...values) => {
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...values].reduce((a, b) => _lcm(a, b));
};

module.exports = {lcm};
