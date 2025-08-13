/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content section
  const mainSection = element.querySelector('section.css-e2mvg2');
  if (!mainSection) return;

  const columnsWrap = mainSection.querySelector('.css-uf9k2e');
  if (!columnsWrap) return;

  // Get left and right cell contents
  const leftCellDiv = columnsWrap.querySelector('.css-1qxl8ps');
  const img = columnsWrap.querySelector('img');
  const leftCell = leftCellDiv ? leftCellDiv : document.createElement('div');
  const rightCell = img ? img : document.createElement('div');

  // Create the table so the header cell spans both columns
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('th');
  headerCell.textContent = 'Columns (columns25)';
  headerCell.colSpan = 2; // Ensure header spans both columns
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);

  const contentRow = document.createElement('tr');
  const leftTd = document.createElement('td');
  leftTd.append(leftCell);
  const rightTd = document.createElement('td');
  rightTd.append(rightCell);
  contentRow.appendChild(leftTd);
  contentRow.appendChild(rightTd);
  table.appendChild(contentRow);

  element.replaceWith(table);
}
