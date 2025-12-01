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

// Chart layout constants
const CHART_LAYOUT = {
  BAR_HEIGHT_SCALE: 0.8, // Bars use 80% of chart height
  BAR_SPACING_RATIO: 0.1, // 10% spacing on each side of bar
  BAR_WIDTH_RATIO: 0.8, // Bar takes 80% of its allocated width
  BAR_CENTER_RATIO: 0.4, // Center point for labels (0.5 would be exact center)
  LABEL_OFFSET_TOP: 10, // Pixels above bar for frequency label
  LABEL_OFFSET_PERCENTAGE: 25, // Pixels above bar for percentage label
  AXIS_LABEL_MARGIN: 10, // Pixels between axis and labels
  AXIS_LABEL_OFFSET: 4, // Vertical offset for axis labels
  TITLE_Y_POSITION: 30, // Y position of chart title
  X_LABEL_LINE_1_OFFSET: 20, // Offset for first line of x-axis label
  X_LABEL_LINE_2_OFFSET: 38, // Offset for second line of x-axis label
  Y_AXIS_DIVISIONS: 5, // Number of divisions on y-axis
  FONT_SIZE_TITLE: 16,
  FONT_SIZE_FREQUENCY: 14,
  FONT_SIZE_PERCENTAGE: 12,
  FONT_SIZE_AXIS_LABEL: 14,
  FONT_SIZE_Y_AXIS: 12
};

/**
 * Check if a draw has consecutive repeats (including wrap-around)
 * @param {string[]} drawn - Array of drawn letters (length = 5)
 * @returns {boolean} - True if there are consecutive repeats
 */
function hasConsecutiveRepeat(drawn) {
  // Check all 5 adjacent pairs in the 5-element draw, treating it as circular:
  //   Position 0 vs Position 1
  //   Position 1 vs Position 2
  //   Position 2 vs Position 3
  //   Position 3 vs Position 4
  //   Position 4 vs Position 0 (wrap-around to check if last matches first)
  //
  // Examples:
  //   AABCF -> consecutive repeat at positions 0-1 (A-A)
  //   ADFEA -> consecutive repeat at positions 4-0 (A-A, wrap-around)
  //   ADFEB -> no consecutive repeats
  for (let i = 0; i < drawn.length; i++) {
    const nextIndex = (i + 1) % drawn.length; // Modulo handles wrap-around
    if (drawn[i] === drawn[nextIndex]) {
      return true;
    }
  }
  return false;
}

/**
 * Generic bar chart renderer
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number[]} data - Array of frequencies for each bar
 * @param {string[]|string[][]} labels - Labels for each bar (string or array of strings for multi-line)
 * @param {string} title - Chart title
 * @param {number} total - Total samples for percentage calculation
 */
function drawBarChart(canvas, data, labels, title, total) {
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
  const barWidth = chartWidth / data.length;

  // Draw bars
  data.forEach((freq, i) => {
    const barHeight = (freq / maxFreq) * chartHeight * CHART_LAYOUT.BAR_HEIGHT_SCALE;
    const x = PADDING + i * barWidth + barWidth * CHART_LAYOUT.BAR_SPACING_RATIO;
    const y = PADDING + chartHeight - barHeight;

    // Bar
    ctx.fillStyle = COLORS.BAR;
    ctx.fillRect(x, y, barWidth * CHART_LAYOUT.BAR_WIDTH_RATIO, barHeight);

    // Frequency label on top of bar
    ctx.fillStyle = COLORS.TEXT_PRIMARY;
    ctx.font = `${CHART_LAYOUT.FONT_SIZE_FREQUENCY}px system-ui`;
    ctx.textAlign = 'center';
    const labelX = x + barWidth * CHART_LAYOUT.BAR_CENTER_RATIO;
    ctx.fillText(freq.toString(), labelX, y - CHART_LAYOUT.LABEL_OFFSET_TOP);

    // Percentage label
    const percentage = ((freq / total) * 100).toFixed(1);
    ctx.fillStyle = COLORS.TEXT_SECONDARY;
    ctx.font = `${CHART_LAYOUT.FONT_SIZE_PERCENTAGE}px system-ui`;
    ctx.fillText(`${percentage}%`, labelX, y - CHART_LAYOUT.LABEL_OFFSET_PERCENTAGE);

    // X-axis labels (support multi-line)
    ctx.fillStyle = COLORS.TEXT_PRIMARY;
    ctx.font = `${CHART_LAYOUT.FONT_SIZE_AXIS_LABEL}px system-ui`;
    const label = labels[i];
    if (Array.isArray(label)) {
      // Multi-line label
      label.forEach((line, lineIndex) => {
        const yOffset =
          lineIndex === 0 ? CHART_LAYOUT.X_LABEL_LINE_1_OFFSET : CHART_LAYOUT.X_LABEL_LINE_2_OFFSET;
        ctx.fillText(line, labelX, PADDING + chartHeight + yOffset);
      });
    } else {
      // Single line label
      ctx.fillText(label, labelX, PADDING + chartHeight + CHART_LAYOUT.X_LABEL_LINE_1_OFFSET);
    }
  });

  // Draw frame (all 4 sides)
  ctx.strokeStyle = COLORS.AXIS;
  ctx.lineWidth = 1;
  ctx.strokeRect(PADDING, PADDING, chartWidth, chartHeight);

  // Y-axis labels
  ctx.fillStyle = COLORS.TEXT_SECONDARY;
  ctx.font = `${CHART_LAYOUT.FONT_SIZE_Y_AXIS}px system-ui`;
  ctx.textAlign = 'right';
  for (let i = 0; i <= CHART_LAYOUT.Y_AXIS_DIVISIONS; i++) {
    const y =
      PADDING +
      chartHeight -
      (i / CHART_LAYOUT.Y_AXIS_DIVISIONS) * chartHeight * CHART_LAYOUT.BAR_HEIGHT_SCALE;
    const value = Math.round((i / CHART_LAYOUT.Y_AXIS_DIVISIONS) * maxFreq);
    ctx.fillText(
      value.toString(),
      PADDING - CHART_LAYOUT.AXIS_LABEL_MARGIN,
      y + CHART_LAYOUT.AXIS_LABEL_OFFSET
    );
  }

  // Title
  ctx.fillStyle = COLORS.TEXT_PRIMARY;
  ctx.font = `bold ${CHART_LAYOUT.FONT_SIZE_TITLE}px system-ui`;
  ctx.textAlign = 'center';
  ctx.fillText(title, WIDTH / 2, CHART_LAYOUT.TITLE_Y_POSITION);
}

/**
 * Draw bar chart for consecutive repeats analysis
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} withRepeats - Count of draws with consecutive repeats
 * @param {number} withoutRepeats - Count of draws without consecutive repeats
 * @param {number} total - Total samples
 */
function drawConsecutiveRepeatsChart(canvas, withRepeats, withoutRepeats, total) {
  const data = [withoutRepeats, withRepeats];
  const labels = [
    ['No Consecutive', 'Repeats'],
    ['Has Consecutive', 'Repeats']
  ];
  const title = `Consecutive Repeats in ${CONFIG.MONTE_CARLO_SAMPLES.toLocaleString()} Random Draws`;

  drawBarChart(canvas, data, labels, title, total);
}

/**
 * Draw histogram on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number[]} data - Histogram data
 * @param {number} total - Total samples
 */
function drawHistogram(canvas, data, total) {
  // Generate labels for each bin (e.g., "0/5", "1/4", "2/3", etc.)
  const labels = data.map((_, i) => `${i}/${5 - i}`);
  const title = `Distribution of Tops (A,B,C) / Bottoms (D,E,F) in ${CONFIG.MONTE_CARLO_SAMPLES.toLocaleString()} Random Draws`;

  drawBarChart(canvas, data, labels, title, total);
}

/**
 * Run Monte Carlo simulation
 */
async function runMonteCarloTest() {
  const button = document.getElementById('runTest');
  const status = document.getElementById('status');
  const canvas = document.getElementById('canvas');
  const consecutiveCanvas = document.getElementById('consecutiveCanvas');

  button.disabled = true;
  status.textContent = 'Running simulation...';
  status.className = 'running';

  // Initialize histogram bins (0-5 zeros)
  const histogram = new Array(CANVAS_CONFIG.BINS).fill(0);

  // Initialize consecutive repeats counters
  let withConsecutiveRepeats = 0;
  let withoutConsecutiveRepeats = 0;

  // Run simulation
  for (let i = 0; i < CONFIG.MONTE_CARLO_SAMPLES; i++) {
    const pool = createPool();
    const { drawn } = drawFromPool(pool, CONFIG.DRAW_SIZE);
    const zerosCount = countZeros(drawn);
    histogram[zerosCount]++;

    // Check for consecutive repeats
    if (hasConsecutiveRepeat(drawn)) {
      withConsecutiveRepeats++;
    } else {
      withoutConsecutiveRepeats++;
    }

    // Update display at intervals
    if (
      (i + 1) % CONFIG.MONTE_CARLO_UPDATE_INTERVAL === 0 ||
      i === CONFIG.MONTE_CARLO_SAMPLES - 1
    ) {
      drawHistogram(canvas, histogram, i + 1);
      drawConsecutiveRepeatsChart(
        consecutiveCanvas,
        withConsecutiveRepeats,
        withoutConsecutiveRepeats,
        i + 1
      );

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
  const consecutiveCanvas = document.getElementById('consecutiveCanvas');
  const runButton = document.getElementById('runTest');

  // Event listener
  runButton.addEventListener('click', runMonteCarloTest);

  // Initial empty charts
  drawHistogram(canvas, new Array(CANVAS_CONFIG.BINS).fill(0), 0);
  drawConsecutiveRepeatsChart(consecutiveCanvas, 0, 0, 0);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
