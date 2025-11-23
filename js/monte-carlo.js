/**
 * Monte Carlo simulation for validating random draw generator
 */

import { CONFIG, countZeros, createPool, drawFromPool } from './utils.js';

// Canvas constants
const CANVAS_CONFIG = {
  PADDING: 60,
  WIDTH: 800,
  HEIGHT: 400,
  BINS: 6, // 0-5 zeros
  COLORS: {
    BACKGROUND: '#ffffff',
    BAR: '#3b82f6',
    TEXT_PRIMARY: '#1f2937',
    TEXT_SECONDARY: '#6b7280',
    AXIS: '#d1d5db'
  }
};

/**
 * Draw histogram on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number[]} data - Histogram data
 * @param {number} total - Total samples
 */
function drawHistogram(canvas, data, total) {
  const ctx = canvas.getContext('2d');
  const { WIDTH, HEIGHT, PADDING, COLORS } = CANVAS_CONFIG;
  const chartWidth = WIDTH - PADDING * 2;
  const chartHeight = HEIGHT - PADDING * 2;

  // Clear canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Background
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (total === 0) return;

  // Find max frequency for scaling
  const maxFreq = Math.max(...data);
  const barWidth = chartWidth / CANVAS_CONFIG.BINS;

  // Draw bars
  data.forEach((freq, i) => {
    const barHeight = (freq / maxFreq) * chartHeight * 0.8;
    const x = PADDING + i * barWidth + barWidth * 0.1;
    const y = PADDING + chartHeight - barHeight;

    // Bar
    ctx.fillStyle = COLORS.BAR;
    ctx.fillRect(x, y, barWidth * 0.8, barHeight);

    // Frequency label on top of bar
    ctx.fillStyle = COLORS.TEXT_PRIMARY;
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(freq.toString(), x + barWidth * 0.4, y - 10);

    // Percentage label
    const percentage = ((freq / total) * 100).toFixed(1);
    ctx.fillStyle = COLORS.TEXT_SECONDARY;
    ctx.font = '12px system-ui';
    ctx.fillText(`${percentage}%`, x + barWidth * 0.4, y - 25);

    // X-axis labels
    ctx.fillStyle = COLORS.TEXT_PRIMARY;
    ctx.font = '14px system-ui';
    ctx.fillText(`${i}/${5 - i}`, x + barWidth * 0.4, PADDING + chartHeight + 20);
  });

  // Y-axis
  ctx.strokeStyle = COLORS.AXIS;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING, PADDING);
  ctx.lineTo(PADDING, PADDING + chartHeight);
  ctx.stroke();

  // X-axis
  ctx.beginPath();
  ctx.moveTo(PADDING, PADDING + chartHeight);
  ctx.lineTo(PADDING + chartWidth, PADDING + chartHeight);
  ctx.stroke();

  // Y-axis labels
  ctx.fillStyle = COLORS.TEXT_SECONDARY;
  ctx.font = '12px system-ui';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = PADDING + chartHeight - (i / 5) * chartHeight * 0.8;
    const value = Math.round((i / 5) * maxFreq);
    ctx.fillText(value.toString(), PADDING - 10, y + 4);
  }

  // Title
  ctx.fillStyle = COLORS.TEXT_PRIMARY;
  ctx.font = 'bold 16px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(
    `Distribution of Tops (A,B,C) / Bottoms (D,E,F) in ${CONFIG.MONTE_CARLO_SAMPLES.toLocaleString()} Random Draws`,
    WIDTH / 2,
    30
  );
}

/**
 * Run Monte Carlo simulation
 */
async function runMonteCarloTest() {
  const button = document.getElementById('runTest');
  const status = document.getElementById('status');
  const canvas = document.getElementById('canvas');

  button.disabled = true;
  status.textContent = 'Running simulation...';
  status.className = 'running';

  // Initialize histogram bins (0-5 zeros)
  const histogram = new Array(CANVAS_CONFIG.BINS).fill(0);

  // Run simulation
  for (let i = 0; i < CONFIG.MONTE_CARLO_SAMPLES; i++) {
    const pool = createPool();
    const { drawn } = drawFromPool(pool, CONFIG.DRAW_SIZE);
    const zerosCount = countZeros(drawn);
    histogram[zerosCount]++;

    // Update display at intervals
    if (
      (i + 1) % CONFIG.MONTE_CARLO_UPDATE_INTERVAL === 0 ||
      i === CONFIG.MONTE_CARLO_SAMPLES - 1
    ) {
      drawHistogram(canvas, histogram, i + 1);

      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, CONFIG.MONTE_CARLO_UI_DELAY));
    }
  }

  status.textContent = 'Simulation complete!';
  status.className = 'complete';
  button.disabled = false;
}

/**
 * Initialize the application
 */
function init() {
  const canvas = document.getElementById('canvas');
  const runButton = document.getElementById('runTest');

  // Event listener
  runButton.addEventListener('click', runMonteCarloTest);

  // Initial empty chart
  drawHistogram(canvas, new Array(CANVAS_CONFIG.BINS).fill(0), 0);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
