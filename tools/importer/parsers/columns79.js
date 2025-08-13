/* global WebImporter */
export default function parse(element, { document }) {
  // Get the flex container with columns
  const flexContainer = element.querySelector('.fl.fl-items-center.fl-justify-around');
  if (!flexContainer) return;
  // Immediate columns (expect two)
  const columns = flexContainer.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // First column: image
  let imageElem = null;
  imageElem = columns[0].querySelector('img');
  // If no image, leave cell empty

  // Second column: all content (headings and button)
  const contentCol = columns[1];
  // Only keep element children (headings, a/button)
  const children = Array.from(contentCol.childNodes)
    .filter(node => (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())))
    .map(node => node.nodeType === Node.ELEMENT_NODE ? node : document.createTextNode(node.textContent));

  // Table header - must match the example exactly
  const headerRow = ['Columns (columns79)'];
  // Columns row (one per column)
  const row = [imageElem, children];

  // Build table
  const cells = [headerRow, row];

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
