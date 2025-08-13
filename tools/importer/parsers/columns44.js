/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main structure
  const footer = element.querySelector('footer');
  if (!footer) return;
  const wrapper = footer.querySelector('.css-uxssyh');
  if (!wrapper) return;

  // Find all columns: three with 'css-suc1e' and one with 'css-j2dfd1'
  const colSelectors = ['.css-suc1e', '.css-j2dfd1'];
  const columns = Array.from(wrapper.children).filter(child => colSelectors.some(sel => child.matches(sel)));

  // Reference each column's block of content (all direct children)
  const colCells = columns.map(col => {
    if (col.childNodes.length === 1) return col.firstChild;
    if (col.childNodes.length > 1) return Array.from(col.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim()));
    return col;
  });

  // Build table: header row is ONE cell, content row is N cells
  const cells = [
    ['Columns (columns44)'], // header row (one column)
    colCells                 // content row (N columns)
  ];
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
