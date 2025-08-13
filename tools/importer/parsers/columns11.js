/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row (must match example exactly)
  const headerRow = ['Columns (columns11)'];

  // 2. Identify logical columns from footer structure
  // a) First column: main logo/language/copyright block (first child)
  // b) Following columns: each child div with a <ul> nav (About, Support, Deployment Options, Data Basics)
  const columns = [];
  const children = Array.from(element.children);

  // Add first child (logo/language/copyright)
  if (children.length > 0) {
    columns.push(children[0]);
  }

  // Add each logical section (starting from index 1, only those with a <ul>)
  for (let i = 1; i < children.length; i++) {
    const child = children[i];
    if (child.querySelector('ul')) {
      columns.push(child);
    }
  }

  // 3. Compose table: header row, then one row with each column block as its own cell
  const tableData = [headerRow, columns];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
