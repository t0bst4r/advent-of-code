/**
 * greatest common divisor
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function gcd(x, y) {
  return (!y ? x : gcd(y, x % y));
}

module.exports = {gcd};
