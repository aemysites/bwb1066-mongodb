/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row exactly as specified
  const headerRow = ['Columns (columns76)'];

  // 2. Extract the headline (should be a span)
  const headline = element.querySelector('span');

  // 3. Extract logo images - find the container holding the logos
  let logoRowDiv = null;
  const divs = element.querySelectorAll(':scope div');
  for (let div of divs) {
    if (div.classList.contains('css-1cbwp8u')) {
      logoRowDiv = div;
      break;
    }
  }
  // logoRowDiv contains several divs each with one img inside
  let logos = [];
  if (logoRowDiv) {
    // Each child div contains an img
    const logoDivs = logoRowDiv.querySelectorAll(':scope > div');
    logoDivs.forEach((ldiv) => {
      const img = ldiv.querySelector('img');
      if (img) logos.push(img);
    });
  }

  // 4. Build the content for the first row after header
  // Compose a fragment: headline, then logos as a row
  const contentCell = document.createElement('div');
  if (headline) contentCell.appendChild(headline);
  if (logos.length > 0) {
    const logosContainer = document.createElement('div');
    logos.forEach(img => {
      logosContainer.appendChild(img);
    });
    contentCell.appendChild(logosContainer);
  }

  // 5. Table rows: header + content
  const cells = [headerRow, [contentCell]];

  // 6. Replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
