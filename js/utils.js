/**
 * Shared utility functions for random draw generation
 */

// Constants
export const LETTERS = {
  TOP: ['A', 'B', 'C'],
  BOTTOM: ['D', 'E', 'F'],
  ALL: ['A', 'B', 'C', 'D', 'E', 'F']
};

export const CONFIG = {
  POOL_SIZE: 12,
  DRAW_SIZE: 5,
  TOTAL_ROUNDS: 9,
  MONTE_CARLO_SAMPLES: 10000,
  MONTE_CARLO_UPDATE_INTERVAL: 250, // used for histogram dynamic plotting
  MONTE_CARLO_UI_DELAY: 50 // used for histogram dynamic plotting
};

/**
 * Create the initial pool: A–F, two of each
 * @returns {string[]} Array of letters representing the pool
 */
export function createPool() {
  const base = LETTERS.ALL;
  return [...base, ...base]; // two instances
}

/**
 * Fisher–Yates shuffle algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled copy of the array
 */
export function shuffle(array) {
  const arr = array.slice(); // copy so we don't mutate input
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Draw n items from the pool without replacement
 * @param {Array} pool - The pool to draw from
 * @param {number} n - Number of items to draw
 * @returns {Object} Object with drawn items and remaining pool
 */
export function drawFromPool(pool, n) {
  const shuffled = shuffle(pool);
  const drawn = shuffled.slice(0, n);
  const remaining = shuffled.slice(n);
  return { drawn, remaining };
}

/**
 * Convert letter to binary: A,B,C = 0, D,E,F = 1
 * @param {string} letter - Letter to convert
 * @returns {number} 0 or 1
 */
export function letterToBinary(letter) {
  return LETTERS.TOP.includes(letter) ? 0 : 1;
}

/**
 * Count zeros (top letters) in a draw
 * @param {string[]} draw - Array of drawn letters
 * @returns {number} Count of top letters
 */
export function countZeros(draw) {
  return draw.filter(letter => letterToBinary(letter) === 0).length;
}
