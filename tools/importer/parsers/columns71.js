/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell
  const headerRow = ['Columns (columns71)'];

  // Get all immediate children representing columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Edge case: if no columns found, do nothing
  if (columns.length === 0) return;

  // Each column cell: group all children in a wrapper div, preserving layout
  const columnCells = columns.map((col) => {
    const wrapper = document.createElement('div');
    Array.from(col.children).forEach((child) => wrapper.appendChild(child));
    return wrapper;
  });

  // Table: header row (single cell), then one row with multiple columns
  const cells = [headerRow, columnCells];

  // Create table with exact structure
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table block
  element.replaceWith(block);
}
