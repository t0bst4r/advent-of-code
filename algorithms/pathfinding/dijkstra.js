/**
 * @param {Array} startNodes
 * @param {(node: any) => Array} getNeighbors
 * @param {(node: any) => number} [getWeight]
 * @param {(node: any) => boolean} [isDone]
 * @returns {{distances: Map<any, number>, previousNodes: Map<any, any>}}
 */
function dijkstra(startNodes, getNeighbors, getWeight, isDone) {
  const distances = new Map();
  const previousNodes = new Map();
  const queue = [];

  startNodes.forEach(item => {
    distances.set(item, 0);
    previousNodes.set(item, undefined);
    queue.push(item);
  });

  while (queue.length > 0) {
    queue.sort((a, b) => (distances.get(a) ?? Infinity) - (distances.get(b) ?? Infinity));
    const current = queue.shift();
    if (isDone && isDone(current)) {
      break;
    }
    getNeighbors(current)
      .forEach(next => {
        const weight = getWeight ? getWeight(next) : 1;
        const distance = distances.get(current) + weight;
        const nextDistance = distances.get(next) ?? Infinity;
        if (distance < nextDistance) {
          distances.set(next, distance);
          previousNodes.set(next, current);
          queue.push(next);
        }
      });
  }
  return {distances, previousNodes};
}

module.exports = {dijkstra};
