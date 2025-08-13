/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns (columns60)'];

  // The top-level element should have direct children as columns
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Each columnDiv may itself be a wrapper for the column content
  // Use each as the sole cell content for each column
  const row = columnDivs.map(col => col);

  // Compose the cells for the block table
  const cells = [headerRow, row];

  // Create the block table as required
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
