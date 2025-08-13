/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches example exactly
  const headerRow = ['Columns (columns67)'];

  // 2. Locate the main grid that contains the columns
  const grid = element.querySelector('.grid');
  if (!grid) return;

  // 3. Find left and right columns by data-testid, fallback to first and second child
  let leftCol = grid.querySelector('[data-testid="side-element"]');
  let rightCol = grid.querySelector('[data-testid="article"]');
  const gridChildren = Array.from(grid.children);
  if (!leftCol && gridChildren.length > 0) leftCol = gridChildren[0];
  if (!rightCol && gridChildren.length > 1) rightCol = gridChildren[1];
  if (!leftCol || !rightCol) return;

  // 4. Left column: Find the image element
  let leftCellContent = [];
  const img = leftCol.querySelector('img');
  if (img) leftCellContent.push(img);
  // If no image, but there's other content, include it
  if (!img && leftCol.children.length > 0) {
    leftCellContent = Array.from(leftCol.children);
  }

  // 5. Right column: Heading, paragraph, CTA link (in order)
  let rightCellContent = [];
  // Heading
  const h2 = rightCol.querySelector('h2');
  if (h2) rightCellContent.push(h2);
  // Paragraph(s)
  const paragraphs = rightCol.querySelectorAll('p');
  paragraphs.forEach(p => rightCellContent.push(p));
  // CTA link
  const ctaLink = rightCol.querySelector('a');
  if (ctaLink) rightCellContent.push(ctaLink);

  // 6. Ensure semantic meaning by keeping original order
  // (all elements are referenced directly)
  const columnsRow = [
    leftCellContent.length === 1 ? leftCellContent[0] : leftCellContent,
    rightCellContent.length === 1 ? rightCellContent[0] : rightCellContent
  ];

  // 7. Create the table (no Section Metadata block needed)
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
