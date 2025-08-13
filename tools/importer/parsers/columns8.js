/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header as specified
  const headerRow = ['Columns (columns8)'];

  // 2. Find the grid with the columns
  const grid = element.querySelector('[automation-testid="flora-GridLayout"]');
  if (!grid) return;
  const gridChildren = Array.from(grid.querySelectorAll(':scope > div'));

  // Prepare left and right column content
  let leftColumnContent = [];
  let rightColumnContent = [];

  // The grid structure in this block is:
  // - 4 divs at the top: mark, heading, description, ctas (these are the left column)
  // - 1 div at the end: image (right column)
  // We'll collect top-level content for left and right, combining all relevant content.

  // Identify left and right column elements by col-* classes and presence of <img>
  gridChildren.forEach((child) => {
    if (child.querySelector('img')) {
      // This is the right column (image)
      const image = child.querySelector('img');
      if (image) rightColumnContent.push(image);
    } else {
      // All other child blocks are left column content
      // Each of these may contain a single block of markup
      // We want to preserve the markup structure, so we push the divs themselves
      // But skip empty/whitespace-only ones
      if (child.textContent.trim() || child.childElementCount > 0) {
        leftColumnContent.push(child);
      }
    }
  });

  // Defensive: fallback to blank cell if empty
  if (leftColumnContent.length === 0) {
    leftColumnContent = [''];
  }
  if (rightColumnContent.length === 0) {
    rightColumnContent = [''];
  }

  // Compose the row for columns
  const contentRow = [leftColumnContent, rightColumnContent];
  const cells = [
    headerRow,
    contentRow
  ];
  
  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
