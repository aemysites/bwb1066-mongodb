/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as specified
  const headerRow = ['Columns (columns72)'];

  // Find the two columns: content (div) and image
  let contentCol = null;
  let imageCol = null;
  // The structure is: <div class="css-e5bzx3"><div ...>...</div><img ...></div>
  for (const child of element.children) {
    if (child.tagName === 'DIV' && !contentCol) {
      contentCol = child;
    } else if (child.tagName === 'IMG' && !imageCol) {
      imageCol = child;
    }
  }

  // Edge case: If any is missing, fall back to empty
  if (!contentCol) contentCol = document.createElement('div');
  if (!imageCol) imageCol = document.createElement('div');

  // Compose the table
  const cells = [
    headerRow,
    [contentCol, imageCol]
  ];

  // Create table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
