/**
 * Main JavaScript for random-draw.html
 */

import { CONFIG, createPool, drawFromPool } from './utils.js';
import { createRoundElement, saveToPDF } from './shared-ui.js';

/**
 * Perform all draws and update UI
 */
function performAllDraws() {
  const roundsContainer = document.getElementById('roundsContainer');
  roundsContainer.innerHTML = '';

  // Create two columns
  const leftColumn = document.createElement('div');
  const rightColumn = document.createElement('div');

  for (let i = 1; i <= CONFIG.TOTAL_ROUNDS; i++) {
    const pool = createPool();
    const { drawn } = drawFromPool(pool, CONFIG.DRAW_SIZE);
    const roundElement = createRoundElement(i, drawn);

    // Snake across columns: odd rounds in left, even rounds in right
    if (i % 2 === 1) {
      leftColumn.appendChild(roundElement);
    } else {
      rightColumn.appendChild(roundElement);
    }
  }

  roundsContainer.appendChild(leftColumn);
  roundsContainer.appendChild(rightColumn);
}

/**
 * Save current draws to PDF
 */
async function saveToPDFHandler() {
  await saveToPDF('roundsContainer', '2-way CF Random Draw Generator Results');
}

/**
 * Initialize the application
 */
function init() {
  const drawBtn = document.getElementById('drawBtn');
  const savePdfBtn = document.getElementById('savePdfBtn');

  drawBtn.addEventListener('click', performAllDraws);
  savePdfBtn.addEventListener('click', saveToPDFHandler);

  // Initial state
  performAllDraws();
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
