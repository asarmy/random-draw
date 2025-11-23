/**
 * Main JavaScript for random-draw.html
 */

/* global html2canvas */

import { CONFIG, createPool, drawFromPool } from './utils.js';

// UI Constants
const UI_CONFIG = {
  IMAGE_PATH: 'images/',
  IMAGE_EXTENSION: '.png'
};

/**
 * Render chips for displaying letters
 * @param {HTMLElement} container - Container element
 * @param {string[]} items - Items to display
 */
function renderChips(container, items) {
  container.innerHTML = '';
  if (items.length === 0) {
    container.textContent = '—';
    return;
  }
  // Display as bold text separated by dashes
  const text = items.join(' - ');
  container.style.fontWeight = '700';
  container.textContent = text;
}

/**
 * Render images for drawn letters
 * @param {HTMLElement} container - Container element
 * @param {string[]} items - Letters to display as images
 */
function renderImages(container, items) {
  container.innerHTML = '';
  if (items.length === 0) {
    container.textContent = '—';
    return;
  }
  items.forEach(item => {
    const img = document.createElement('img');
    img.className = 'letter-image';
    img.src = `${UI_CONFIG.IMAGE_PATH}${item.toLowerCase()}${UI_CONFIG.IMAGE_EXTENSION}`;
    img.alt = item;
    img.title = item;
    container.appendChild(img);
  });
}

/**
 * Create a round element
 * @param {number} roundNumber - Round number
 * @param {string[]} drawn - Drawn letters
 * @returns {HTMLElement} Round element
 */
function createRoundElement(roundNumber, drawn) {
  const roundDiv = document.createElement('div');
  roundDiv.className = 'round';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'round-title';
  titleDiv.textContent =
    roundNumber === CONFIG.TOTAL_ROUNDS ? 'Tie-breaker' : `Round ${roundNumber}`;

  const chipsDiv = document.createElement('div');
  chipsDiv.className = 'chips';
  renderChips(chipsDiv, drawn);

  const imagesDiv = document.createElement('div');
  imagesDiv.className = 'image-container';
  renderImages(imagesDiv, drawn);

  roundDiv.appendChild(titleDiv);
  roundDiv.appendChild(chipsDiv);
  roundDiv.appendChild(imagesDiv);

  return roundDiv;
}

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
async function saveToPDF() {
  const { jsPDF } = window.jspdf;

  // Create a copy of the rounds container for PDF generation
  const originalContainer = document.getElementById('roundsContainer');
  const tempContainer = originalContainer.cloneNode(true);

  // Create a temporary div for PDF content
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '1600px'; // Wider to fit images in rows
  tempDiv.style.padding = '30px';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  // Add title
  const title = document.createElement('h1');
  title.textContent = '2-way CF Random Draw Generator Results';
  title.style.textAlign = 'center';
  title.style.marginBottom = '15px';
  title.style.fontSize = '28px';
  title.style.fontWeight = '600';

  // Style the container to match the grid layout
  tempContainer.style.display = 'grid';
  tempContainer.style.gridTemplateColumns = '1fr 1fr';
  tempContainer.style.gap = '20px';
  tempContainer.style.marginTop = '10px';

  // Style all rounds
  const rounds = tempContainer.querySelectorAll('.round');
  rounds.forEach(round => {
    round.style.marginBottom = '16px';
    round.style.padding = '12px';
    round.style.background = '#f9fafb';
    round.style.borderRadius = '8px';

    // Force images to one row
    const imageContainer = round.querySelector('.image-container');
    if (imageContainer) {
      imageContainer.style.display = 'flex';
      imageContainer.style.flexWrap = 'nowrap'; // Force single row
      imageContainer.style.gap = '6px';
    }

    // Style images
    const images = round.querySelectorAll('.letter-image');
    images.forEach(img => {
      img.style.width = '90px';
      img.style.height = '90px';
      img.style.borderRadius = '6px';
      img.style.border = '2px solid #e5e7eb';
    });

    // Style text container
    const chipsContainer = round.querySelector('.chips');
    if (chipsContainer) {
      chipsContainer.style.fontWeight = '700';
      chipsContainer.style.fontSize = '0.95rem';
    }
  });

  tempDiv.appendChild(title);
  tempDiv.appendChild(tempContainer);
  document.body.appendChild(tempDiv);

  try {
    // Convert to canvas with dynamic height
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Create PDF in landscape letter format (11 x 8.5 inches)
    const pdf = new jsPDF('landscape', 'in', 'letter');

    // PDF dimensions in inches
    const pdfWidth = 11;
    const pdfHeight = 8.5;
    const margin = 0.5;
    const maxWidth = pdfWidth - margin * 2;
    const maxHeight = pdfHeight - margin * 2;

    // Calculate scaling to fit page
    const imgAspectRatio = canvas.width / canvas.height;
    const pageAspectRatio = maxWidth / maxHeight;

    let imgWidth, imgHeight;

    if (imgAspectRatio > pageAspectRatio) {
      // Width is the limiting factor
      imgWidth = maxWidth;
      imgHeight = maxWidth / imgAspectRatio;
    } else {
      // Height is the limiting factor
      imgHeight = maxHeight;
      imgWidth = maxHeight * imgAspectRatio;
    }

    // Center the image on the page
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

    // Save the PDF
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[:-]/g, '');
    pdf.save(`random-draw-${timestamp}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
}

/**
 * Initialize the application
 */
function init() {
  const drawBtn = document.getElementById('drawBtn');
  const savePdfBtn = document.getElementById('savePdfBtn');

  drawBtn.addEventListener('click', performAllDraws);
  savePdfBtn.addEventListener('click', saveToPDF);

  // Initial state
  performAllDraws();
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
