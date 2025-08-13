/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all direct <a> children (buttons)
  const links = Array.from(element.querySelectorAll(':scope > a'));
  const numCols = links.length || 1;

  // Use WebImporter.DOMUtils.createTable to build the table structure
  const cells = [
    ['Columns (columns29)'],
    links.length ? links : ['']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Ensure header row spans all columns: set colspan on <th>
  const headerTh = table.querySelector('tr:first-child th');
  if (headerTh) {
    headerTh.setAttribute('colspan', numCols);
  }

  // Replace the original element with the new table
  element.replaceWith(table);
}