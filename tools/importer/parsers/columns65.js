/* global WebImporter */
export default function parse(element, { document }) {
  // Extract left column (logo/link)
  let leftCell = '';
  const brandContainer = element.querySelector('.brand-container');
  if (brandContainer) {
    const logoLink = brandContainer.querySelector('a');
    if (logoLink) leftCell = logoLink;
  }
  // Extract right column (nav link)
  let rightCell = '';
  const navLink = element.querySelector('.custom-nav-item');
  if (navLink) rightCell = navLink;
  // Header row: single column (should only be one cell!)
  const headerRow = ['Columns (columns65)'];
  // Content row: two columns
  const contentRow = [leftCell, rightCell];
  // Build the table structure
  const cells = [
    headerRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Fix to ensure the header row is a single cell that spans two columns
  // (required for correct structure as per the markdown example)
  const th = table.querySelector('tr:first-child th');
  if (th && table.rows[1] && table.rows[1].cells.length > 1) {
    th.colSpan = table.rows[1].cells.length;
  }
  element.replaceWith(table);
}