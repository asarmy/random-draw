/**
 * Main JavaScript for manual-draw.html
 */

import { createRoundElement, saveToPDF } from './shared-ui.js';

/**
 * Parse user input into rounds
 * @param {string} input - User input text
 * @returns {Object} Object with rounds array and error message if any
 */
function parseInput(input) {
  // Remove extra whitespace and convert to uppercase
  const cleaned = input.trim().toUpperCase();

  if (!cleaned) {
    return { rounds: [], error: 'Please enter at least one round.' };
  }

  // Split by comma or whitespace
  const roundStrings = cleaned.split(/[,\s]+/).filter(r => r.length > 0);

  const rounds = [];
  const validLetters = new Set(['A', 'B', 'C', 'D', 'E', 'F']);

  for (let i = 0; i < roundStrings.length; i++) {
    const roundStr = roundStrings[i];

    // Check if round has exactly 5 letters
    if (roundStr.length !== 5) {
      return {
        rounds: [],
        error: `Round ${i + 1} must have exactly 5 formations (found ${roundStr.length}): "${roundStr}"`
      };
    }

    // Check if all characters are valid letters
    const letters = roundStr.split('');
    for (const letter of letters) {
      if (!validLetters.has(letter)) {
        return {
          rounds: [],
          error: `Round ${i + 1} contains invalid formation "${letter}". Only A-F are allowed.`
        };
      }
    }

    // Check that each letter appears at most twice (matching competition rules)
    const letterCounts = {};
    for (const letter of letters) {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      if (letterCounts[letter] > 2) {
        return {
          rounds: [],
          error: `Round ${i + 1} has formation "${letter}" more than twice. Each formation can only appear twice per round.`
        };
      }
    }

    rounds.push(letters);
  }

  return { rounds, error: null };
}

/**
 * Generate and display rounds from user input
 */
function generateDisplay() {
  const input = document.getElementById('drawInput').value;
  const errorDiv = document.getElementById('inputError');
  const roundsContainer = document.getElementById('roundsContainer');

  // Clear previous state
  errorDiv.textContent = '';
  roundsContainer.innerHTML = '';

  // Parse input
  const { rounds, error } = parseInput(input);

  if (error) {
    errorDiv.textContent = error;
    return;
  }

  if (rounds.length === 0) {
    errorDiv.textContent = 'Please enter at least one round.';
    return;
  }

  // Create two columns
  const leftColumn = document.createElement('div');
  const rightColumn = document.createElement('div');

  // Generate round elements with sequential numbering (no tie-breaker)
  for (let i = 0; i < rounds.length; i++) {
    const roundNumber = i + 1;
    const roundElement = createRoundElement(roundNumber, rounds[i], null);

    // Snake across columns: odd rounds in left, even rounds in right
    if (roundNumber % 2 === 1) {
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
  const roundsContainer = document.getElementById('roundsContainer');

  if (!roundsContainer.hasChildNodes()) {
    alert('Please generate a display first before saving to PDF.');
    return;
  }

  await saveToPDF('roundsContainer', '2-way CF Draw Results');
}

/**
 * Initialize the application
 */
function init() {
  const generateBtn = document.getElementById('generateBtn');
  const savePdfBtn = document.getElementById('savePdfBtn');
  const drawInput = document.getElementById('drawInput');

  generateBtn.addEventListener('click', generateDisplay);
  savePdfBtn.addEventListener('click', saveToPDFHandler);

  // Allow Enter key to trigger generation (with Ctrl/Cmd modifier to avoid interfering with newlines)
  drawInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      generateDisplay();
    }
  });
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
