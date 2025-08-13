/* global WebImporter */
export default function parse(element, { document }) {
  // Find the header container inside the block
  const header = element.querySelector('header');
  if (!header) return;

  // The header contains two main columns:
  // 1. Text/info block (left)
  // 2. Image block (right)

  // Get all immediate children of header (should be two columns)
  const cols = header.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  const textCol = cols[0];
  const imgCol = cols[1];

  // Safeguard: If a column is empty, use an empty string instead
  const leftCell = textCol && textCol.childNodes.length ? textCol : '';
  const rightCell = imgCol && imgCol.childNodes.length ? imgCol : '';

  // 2 columns, 1 row of content
  const cells = [
    ['Columns (columns13)'], // header matches example
    [leftCell, rightCell]
  ];

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
