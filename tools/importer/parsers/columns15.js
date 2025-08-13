/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container that holds the columns
  const box = element.querySelector('.CardGrid__CardGridBox-sc-4okswf-3');
  if (!box) return;

  // Get all direct children that are individual column containers
  const columns = Array.from(box.children).filter(child => child.tagName === 'SPAN');
  if (columns.length === 0) return;

  // Prepare the header row - exactly as required
  const headerRow = ['Columns (columns15)'];

  // Second row: Each column cell gets the corresponding span element (which contains all content for that column)
  const columnsRow = columns;

  // Build the cells array for the block table
  const cells = [
    headerRow,
    columnsRow
  ];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
