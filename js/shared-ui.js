/**
 * Shared UI functions for rendering draws and generating PDFs
 */

/* global html2canvas */

import { CONFIG } from './utils.js';

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
export function renderChips(container, items) {
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
export function renderImages(container, items) {
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
 * @param {number} totalRounds - Total number of rounds (for tie-breaker detection)
 * @returns {HTMLElement} Round element
 */
export function createRoundElement(roundNumber, drawn, totalRounds = CONFIG.TOTAL_ROUNDS) {
  const roundDiv = document.createElement('div');
  roundDiv.className = 'round';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'round-title';
  titleDiv.textContent =
    totalRounds && roundNumber === totalRounds ? 'Tie-breaker' : `Round ${roundNumber}`;

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
 * Create a styled title element for PDF
 * @param {string} titleText - Title text
 * @returns {HTMLElement} Styled title element
 */
function createPDFTitle(titleText) {
  const title = document.createElement('h1');
  title.textContent = titleText;
  title.style.textAlign = 'center';
  title.style.marginBottom = '15px';
  title.style.fontSize = '28px';
  title.style.fontWeight = '600';
  return title;
}

/**
 * Apply PDF-specific styles to a cloned container
 * @param {HTMLElement} container - Container element to style
 */
function styleContainerForPDF(container) {
  // Style the container grid layout
  container.style.display = 'grid';
  container.style.gridTemplateColumns = '1fr 1fr';
  container.style.gap = '20px';
  container.style.marginTop = '10px';

  // Style all rounds
  const rounds = container.querySelectorAll('.round');
  rounds.forEach(round => {
    round.style.marginBottom = '16px';
    round.style.padding = '12px';
    round.style.background = '#f9fafb';
    round.style.borderRadius = '8px';

    // Force images to one row
    const imageContainer = round.querySelector('.image-container');
    if (imageContainer) {
      imageContainer.style.display = 'flex';
      imageContainer.style.flexWrap = 'nowrap';
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
}

/**
 * Create temporary container for PDF rendering
 * @param {HTMLElement} contentContainer - Container with rounds
 * @param {string} titleText - Title text
 * @returns {HTMLElement} Temporary div ready for rendering
 */
function createTempPDFContainer(contentContainer, titleText) {
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '1600px';
  tempDiv.style.padding = '30px';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const title = createPDFTitle(titleText);
  tempDiv.appendChild(title);
  tempDiv.appendChild(contentContainer);

  return tempDiv;
}

/**
 * Calculate dimensions for fitting image in PDF page
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} pdfWidth - PDF page width
 * @param {number} pdfHeight - PDF page height
 * @param {number} margin - Page margin
 * @returns {Object} Object with imgWidth, imgHeight, x, y
 */
function calculatePDFDimensions(canvas, pdfWidth, pdfHeight, margin) {
  const maxWidth = pdfWidth - margin * 2;
  const maxHeight = pdfHeight - margin * 2;

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

  return { imgWidth, imgHeight, x, y };
}

/**
 * Convert element to canvas
 * @param {HTMLElement} element - Element to convert
 * @returns {Promise<HTMLCanvasElement>} Canvas element
 */
async function convertToCanvas(element) {
  return await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });
}

/**
 * Save rounds to PDF
 * @param {string} containerId - ID of the rounds container
 * @param {string} titleText - Title for the PDF
 */
export async function saveToPDF(containerId, titleText) {
  const { jsPDF } = window.jspdf;

  // Get and clone the container
  const originalContainer = document.getElementById(containerId);
  const tempContainer = originalContainer.cloneNode(true);

  // Apply PDF-specific styles
  styleContainerForPDF(tempContainer);

  // Create temporary container for rendering
  const tempDiv = createTempPDFContainer(tempContainer, titleText);
  document.body.appendChild(tempDiv);

  try {
    // Convert to canvas
    const canvas = await convertToCanvas(tempDiv);

    // Create PDF
    const pdf = new jsPDF('landscape', 'in', 'letter');
    const pdfWidth = 11;
    const pdfHeight = 8.5;
    const margin = 0.5;

    // Calculate dimensions
    const { imgWidth, imgHeight, x, y } = calculatePDFDimensions(
      canvas,
      pdfWidth,
      pdfHeight,
      margin
    );

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
