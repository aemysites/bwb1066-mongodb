/* global WebImporter */
export default function parse(element, { document }) {
  // The block header matches the example exactly
  const headerRow = ['Columns (columns3)'];

  // Identify direct children for the three columns
  // Left: .horizontal-card-container-column
  // Middle: (no content in source, so empty)
  // Right: .sidebar
  const directDivs = Array.from(element.querySelectorAll(':scope > div'));
  let leftBlock = null;
  let rightBlock = null;

  for (const div of directDivs) {
    if (div.classList.contains('horizontal-card-container-column')) {
      leftBlock = div;
    } else if (div.classList.contains('sidebar')) {
      rightBlock = div;
    }
  }

  // Always produce three columns for Columns (columns3)
  const row = [leftBlock || '', '', rightBlock || ''];

  // Build and replace block table
  const cells = [headerRow, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
