/* global WebImporter */
export default function parse(element, { document }) {
  // The block name matches the header in the example
  const headerRow = ['Columns (columns43)'];

  // Get the direct children columns of the block
  // This block is structured with two main content areas: aside (sidebar) and main column (article, buttons)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  let leftCol = null;
  let rightCol = null;

  // The first column has article content and buttons, the second is an aside (sidebar)
  // In this HTML, the first div is main content; the second div is sidebar.
  if (columns.length >= 2) {
    leftCol = columns[0];
    rightCol = columns[1];
  } else if (columns.length === 1) {
    leftCol = columns[0];
    // Find the aside sibling if present (could be at top-level)
    rightCol = element.querySelector(':scope > aside');
  } else {
    // Fallback: find direct aside and divs
    leftCol = element.querySelector(':scope > div');
    rightCol = element.querySelector(':scope > aside');
  }

  // Compose left column cell: article (content), and below action buttons/links
  let leftCellContent = [];
  if (leftCol) {
    // Get article content
    const article = leftCol.querySelector('article');
    if (article) leftCellContent.push(article);

    // Get any spans/buttons/links at the same column level after the article
    // These are action buttons ("Read Analyst Report", "Email Me the PDF")
    const actionSpans = leftCol.querySelectorAll(':scope > span');
    actionSpans.forEach(span => {
      leftCellContent.push(span);
    });
    // Also any <a> at top level
    const actionLinks = leftCol.querySelectorAll(':scope > a');
    actionLinks.forEach(a => {
      leftCellContent.push(a);
    });
    // Include <hr> for separation if present
    const hr = leftCol.querySelector(':scope > hr');
    if (hr) {
      leftCellContent.push(hr);
    }
  }
  // If nothing is found, fallback to the leftCol itself
  if (leftCellContent.length === 0 && leftCol) {
    leftCellContent = [leftCol];
  }
  // If only one element, pass directly
  if (leftCellContent.length === 1) {
    leftCellContent = leftCellContent[0];
  }

  // Compose right column cell: aside content (button, share, social)
  let rightCellContent = [];
  if (rightCol) {
    // Reference all direct children of aside
    const children = Array.from(rightCol.children);
    children.forEach(child => {
      rightCellContent.push(child);
    });
  }
  // Fallback
  if (rightCellContent.length === 0 && rightCol) {
    rightCellContent = [rightCol];
  }
  if (rightCellContent.length === 1) {
    rightCellContent = rightCellContent[0];
  }

  // Build the table with header and content columns
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
